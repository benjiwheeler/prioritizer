class TaskOrdering
  extend MetricsCollector

  def self.redis_tasks_key_prefix(user)
    user.redis_key + '::tasks'
  end

  def self.USER_TASKS_REDIS_VALID_SECS
    60 * 60
  end

  def self.redis_user_tag_tasks_key(user, tag_str)
    TaskOrdering.redis_tasks_key_prefix(user) +
      '::tag:' + tag_str.to_s + '::task_ids'
  end

  def self.expire_redis_tasks_keys!(user)
    keys = $redis.keys "#{redis_tasks_key_prefix(user)}*"
    $redis.del(*keys) unless keys.empty?
  end

  def self.order_by_ease(unsorted_tasks)
    unsorted_tasks.sort do |task_a, task_b|
      task_b.get_overall_ease! * 4 +
        task_b.get_overall_imp_alone! * 2 +
        task_b.get_session_rand! \
        <=> \
        task_a.get_overall_ease! * 4 +
        task_a.get_overall_imp_alone! * 2 +
        task_a.get_session_rand!
    end
  end

  # truth it it's not JUST by ease, it also considers importance, timing and random factor.
  # but ease is heavily weighted.
  def self.tasks_ordered_by_ease!(user, tag_str = nil)
    unsorted_tasks = user.tasks.where(done: false).includes(:tags)
    if tag_str.present? && tag_str != 'all' # 'all' is the same as no tag!
      unsorted_tasks = unsorted_tasks.where(done: false)
                                     .tagged_with([tag_str, 'all'], any: true)
                                     .includes(:tags)
      # 'all' is always ok!
    end

    # sort with best first, worst last
    sorted_tasks = TaskOrdering.order_by_ease(unsorted_tasks)
    Rails.logger.warn("after ease sorting, order is: #{sorted_tasks.to_json}")
    sorted_tasks
  end

  # sorts based on vital+immediate, with bonuses for several tasks that are especially low in heavy+long.
  # stores the resulting ordering in redis.
  def self.generate_overall_ordered_tasks!(user, tag_str = nil)
    #
    # set ease bonus
    #
    task_bonuses = {}
    tasks_by_ease = TaskOrdering.tasks_ordered_by_ease!(user, tag_str)
    by_ease_num_divisions = 8 # like a quartile or quintile
    by_ease_num_to_give_bonus = 3 # out of by_ease_num_divisions
    if by_ease_num_to_give_bonus > by_ease_num_divisions
      by_ease_num_to_give_bonus = by_ease_num_divisions
    end
    by_ease_count_per_division = (tasks_by_ease.count / (by_ease_num_divisions + 0.000001)).to_i
    by_ease_first_division_bonus = 1.0
    by_ease_last_division_bonus = 0.0
    this_bonus = by_ease_first_division_bonus
    ease_index = 0
    # only do it the min number of times we should
    [by_ease_num_to_give_bonus, tasks_by_ease.count].min.times do
      if ease_index >= tasks_by_ease.count
        ease_index = tasks_by_ease.count - 1
      end
      task_to_give_bonus = tasks_by_ease[ease_index]
      task_bonuses[task_to_give_bonus.id] = this_bonus
      Rails.logger.warn("adding ease bonus of #{this_bonus} to task #{task_to_give_bonus.to_s}")
      # adjust index for next division
      ease_index += by_ease_count_per_division
      # adjust bonus for next division
      this_bonus -= (by_ease_first_division_bonus - by_ease_last_division_bonus) / (by_ease_num_divisions - 1 + 0.0000001)
    end

    #
    # get complete ordering with all factors considered
    #
    unsorted_tasks = user.tasks.where(done: false).includes(:tags)
    if tag_str.present? && tag_str != 'all' # 'all' is the same as no tag!
      unsorted_tasks = unsorted_tasks.where(done: false).tagged_with([tag_str, 'all'], :any => true) # 'all' is always ok!
    end
    unsorted_tasks.each do |task|
      if task_bonuses.has_key?(task.id)
        task.add_session_bonus(task_bonuses[task.id])
      end
    end
    # sort with best first, worst last
    sorted_tasks = unsorted_tasks.sort do |taskA, taskB|
      taskB.get_overall_imp_alone! + taskB.get_session_rand! + taskB.session_bonus_with_default  \
      <=> \
      taskA.get_overall_imp_alone! + taskA.get_session_rand! + taskA.session_bonus_with_default
    end
    Rails.logger.warn("after sorting, order is: #{sorted_tasks.to_json}")
    # first, clear the key
    $redis.del(TaskOrdering.redis_user_tag_tasks_key(user, tag_str));
    sorted_tasks.each do |task|
      Rails.logger.warn("redis adding task #{task.id} to #{TaskOrdering.redis_user_tag_tasks_key(user, tag_str)}")
      $redis.rpush(TaskOrdering.redis_user_tag_tasks_key(user, tag_str), task.id);
    end
    # expire this ordering in an hour even if no significant changes to the tasks have been made
    $redis.expire TaskOrdering.redis_user_tag_tasks_key(user, tag_str), TaskOrdering.USER_TASKS_REDIS_VALID_SECS
    return sorted_tasks.map{|task| task.id}
  end

  def self.n_ordered_tasks!(user, tag_str = nil, n = :all)
    n_ordered_tasks = []
    # get the entire ordered list from Redis
    cached_ordered_task_ids = $redis.lrange(TaskOrdering.redis_user_tag_tasks_key(user, tag_str), 0, -1)
    if cached_ordered_task_ids.blank?
      Rails.logger.warn("redis tag blank: #{TaskOrdering.redis_user_tag_tasks_key(user, tag_str)}")
      collect_metrics("generate_overall_ordered_tasks!(user #{user}, tag_str #{tag_str})") do
        # NOTE: do this in console. It's doing 4x the required queries!?
        cached_ordered_task_ids = TaskOrdering.generate_overall_ordered_tasks!(user, tag_str)
      end
    else
      # crucial to convert to int, because redis ONLY stores strings
      cached_ordered_task_ids = cached_ordered_task_ids.map{|task_id_str| task_id_str.to_i}
      Rails.logger.warn("redis tag #{TaskOrdering.redis_user_tag_tasks_key(user, tag_str)} not blank; has #{cached_ordered_task_ids.count} items")
    end
    # now we have cached_ordered_task_ids, list of ids with type int, ordered by priority

    # build an ordered list of only valid and unfinished tasks
    # NOTE: is this really necessary?
    # n_ordered_tasks = cached_ordered_task_ids.reduce([]) { |memo, id|
    #   thisTask = Task.find_by(id: id)
    #   if thisTask.present? && thisTask.done == false
    #     memo.push thisTask
    #   else
    #     memo
    #   end
    # }

    # faster way, per http://stackoverflow.com/a/26868980/2308190
    # note i'm no longer making sure these are done!
    # The problem with this was that it loses the ordering! argh
   # collect_metrics("Getting tasks from cached_ordered_task_ids for user #{user}, tag_str #{tag_str})") do
    test_arr = [100, 300, 500, 700, 900]
    test_arr = [500, 100].sort_by{|num| test_arr.index(num)}
    Rails.logger.warn("1st test_arr: #{test_arr}")
    if cached_ordered_task_ids.present?
      Rails.logger.warn("class of members of cached_ordered_task_ids is #{cached_ordered_task_ids.first.class}")
    end

    # complete and total fucking nightmare...
    # all due to some weird string vs int inconsistency in console vs. heroku
    n_ordered_tasks = Task.where(id: cached_ordered_task_ids).includes(:tags)
    Rails.logger.warn("n_ordered_tasks, right after running initial query, before sorting: #{n_ordered_tasks.to_a}")
    Rails.logger.warn("cached_ordered_task_ids: #{cached_ordered_task_ids}")
    Rails.logger.warn("index of 590: #{cached_ordered_task_ids.index('590')}; index of 542: #{cached_ordered_task_ids.index('542')}; ")
    # this to_s is the key... which is absurd, because in the console, the type of each
    # item of cached_ordered_task_ids is definitely a fixnum, NOT a string!!!
    n_ordered_tasks = n_ordered_tasks.sort_by{|task| cached_ordered_task_ids.index(task.id)}
    test_arr = ['542', '590'].sort_by{|num| cached_ordered_task_ids.index(num)}
    Rails.logger.warn("2nd test_arr: #{test_arr}")
    test_arr = [542, 590].sort_by{|num| cached_ordered_task_ids.index(num)}
    Rails.logger.warn("3rd test_arr: #{test_arr}")
    Rails.logger.warn("n_ordered_tasks, after sorting: #{n_ordered_tasks}")
#  end
    #index_by(&:id).values_at(*cached_ordered_task_ids)

    # get just the first n tasks
    if n.is_a? Numeric
      n_ordered_tasks = n_ordered_tasks.first(n)
    end
    Rails.logger.warn("returning array of #{n_ordered_tasks.count} elements")
    Rails.logger.warn("cached_ordered_task_ids: #{cached_ordered_task_ids}")
    Rails.logger.warn("n_ordered_tasks: #{n_ordered_tasks}")
    return n_ordered_tasks
  end

  def self.first_ordered_task!(user, tag_str = nil)
    one_ordered_task_array = TaskOrdering.n_ordered_tasks!(user, tag_str, 1)
    if one_ordered_task_array.blank?
      Rails.logger.warn("user:first_ordered_task!: no tasks for user #{user}")
      return nil
    else
      return one_ordered_task_array.first
    end
  end

  # NOTE: need to integrate this logic more smartly
  def self.get_next_task!(user, tag_str = nil)
    first_ordered_task = TaskOrdering.first_ordered_task!(user, tag_str)
    if first_ordered_task.present?
      return first_ordered_task.first_youngest_descendent({done: false})
#      return first_ordered_task.first_task_in_family_tree({done: false})
    else
      Rails.logger.error("user:get_next_task!: error: first_ordered_task is nil")
      return nil
    end
  end

end
