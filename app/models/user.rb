class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
#  devise :database_authenticatable, :registerable,
#         :recoverable, :rememberable, :trackable, :validatable
  devise :rememberable, :trackable, :timeoutable
  devise :omniauthable, :omniauth_providers => [:facebook, :twitter]
  has_many :authorizations, dependent: :destroy
  has_many :tasks, dependent: :destroy

  def redis_key
    "user:#{self.id}"
  end

  def redis_tasks_key_prefix
    self.redis_key + "::tasks"
  end

  def User.USER_TASKS_REDIS_VALID_SECS
    10
  end

  def to_s
    self.name
  end

  def redis_user_tag_tasks_key(tag_str)
    self.redis_tasks_key_prefix + "::tag:" + tag_str.to_s + "::task_ids"
  end

  def expire_redis_tasks_keys!
    keys = $redis.keys "#{redis_tasks_key_prefix}*"
    $redis.del(*keys) unless keys.empty?
  end

  def name
    self.authorizations.each do |auth|
      return auth.name unless auth.name.blank?
    end
    self.authorizations.each do |auth|
      return auth.nickname unless auth.nickname.blank?
    end
    self.authorizations.each do |auth|
      return auth.email unless auth.email.blank?
    end
    return self.key unless self.key.blank?
    return "Guest"
  end

  def has_auth?(provider)
    self.authorizations.where(provider: provider.to_s).any?
  end

  def auth_field(provider, fieldname)
    return nil unless has_auth?(provider)
    self.authorizations.where(provider: provider.to_s).first.attributes[fieldname.to_s]
  end

  def User.find_from_key_or_create(user_key)
    existing_user = find_by_key(user_key)
    if existing_user.blank?
      User.create_from_key(user_key)
    end
  end

  def User.create_from_key(user_key)
    newuser = User.new
    newuser.key = user_key
    newuser.save!(:validate => false) # don't worry about email
    newuser
  end

  def User.create_guest
    new_user = User.new
    new_user.save
    return new_user
  end

  def guest?
    key.blank?
  end

  def registered?
    !guest?
  end

  def register_with_key_and_save(new_key)
    assert(new_key.present?)
    existing_user_with_key = User.find_by_key(new_key)
    return existing_user_with_key if existing_user_with_key != nil
    # so there's no existing user with that key? let's upgrade current user!
    self.key = new_key
    self.save
    true
  end

  # need to copy in other_user content to here, destroy other_user!
  def merge_copy_user(other_user)
    Rails.logger.warn("mergeing!!!!!!")
    other_user.authorizations.each do |authorization|
      # i'm 99% sure these lines are equivalent, see:http://stackoverflow.com/questions/13649540/how-to-assign-a-has-many-belongs-to-relation-properly-in-rails-activerecord
      self.authorizations << authorization.copy
      authorization.user = self
      authorization.save
    end
    self.save
    other_user.save
    Rails.logger.warn("merge_copy_user: other user has : #{other_user.authorizations.count} auths!")
    Rails.logger.warn("merge_copy_user: this user has : #{self.authorizations.count} auths!")
  end

  def User.merge_users(user_a, user_b)
    return user_a if user_b.nil?
    return user_b if user_a.nil?
    return user_a if user_a == user_b
    # both are not nil
    # users are both valid, and might have mutually exclusive content/associations!!!!
    # other_user will grow; current_user will die
    user_a.merge_copy_user(user_b)
    d { user_b }
    user_b.delete
    return user_a
  end

  # task handling
  def n_ordered_tasks!(tag_str = nil, n = :all)
    cached_ordered_task_ids = $redis.lrange(self.redis_user_tag_tasks_key(tag_str), 0, -1)
    if cached_ordered_task_ids.blank?
      Rails.logger.warn("redis tag blank: #{self.redis_user_tag_tasks_key(tag_str)}")
      cached_ordered_task_ids = self.generate_ordered_tasks!(tag_str)
    else
      Rails.logger.warn("redis tag #{self.redis_user_tag_tasks_key(tag_str)} not blank; has #{cached_ordered_task_ids.count} items")
    end
    n_ordered_task_ids = cached_ordered_task_ids
#    n_ordered_tasks = n_ordered_task_ids.map { |id| Task.find_by(id: id) }
    n_ordered_tasks = n_ordered_task_ids.reduce([]) { |memo, id|
      thisTask = Task.find_by(id: id)
      if thisTask.present? && thisTask.done == false
        memo.push thisTask
      else
        memo
      end
    }
    if n.is_a? Numeric
      n_ordered_tasks = n_ordered_tasks.first(n)
    end

    Rails.logger.warn("returning array of #{n_ordered_tasks.count} elements")
    return n_ordered_tasks
  end

  def first_ordered_task!(tag_str = nil)
    one_ordered_task_array = self.n_ordered_tasks!(tag_str, 1)
    if one_ordered_task_array.blank?
      Rails.logger.warn("user:first_ordered_task!: no tasks for user #{self}")
      return nil
    else
      return one_ordered_task_array.first
    end
  end

  def generate_ordered_tasks!(tag_str = nil)
    sorted_tasks = self.tasks
    if tag_str.present?
      sorted_tasks = sorted_tasks.tagged_with(tag_str)
    end
    sorted_tasks.each do |task|
      task.generate_importance! #+ Task.random_score
    end
    sorted_tasks = sorted_tasks.sort do |taskA, taskB|
      #Rails.logger.warn("during sorting: score of id #{task.id} is #{score}")
      taskA.overall_imp <=> taskB.overall_imp
    end
    Rails.logger.warn("after sorting, order is: #{sorted_tasks.to_json}")
    sorted_tasks.each do |task|
      Rails.logger.warn("after sorting: score of id #{task.id} is #{task.overall_imp}")
    end.reverse!
    sorted_tasks.each do |task|
      Rails.logger.warn("redis adding task #{task.id} to #{self.redis_user_tag_tasks_key(tag_str)}")
      $redis.rpush(self.redis_user_tag_tasks_key(tag_str), task.id);
    end
    $redis.expire self.redis_user_tag_tasks_key(tag_str), User.USER_TASKS_REDIS_VALID_SECS
    return sorted_tasks
  end

  def get_next_task!(tag_str = nil)
    first_ordered_task = self.first_ordered_task!(tag_str)
    if first_ordered_task.present?
      return first_ordered_task.first_task_in_family_tree()
    else
      Rails.logger.error("user:get_next_task!: error: first_ordered_task is nil")
      return nil
    end
  end

  def tags
    # alphabetize these? currently ordered by frequency
    ActsAsTaggableOn::Tag.all.order(taggings_count: :desc)
  end

  def most_likely_new_tags
    ActsAsTaggableOn::Tag.all.order(taggings_count: :desc).limit(1)
  end

  def tag_list
    list_str = ""
    ActsAsTaggableOn::Tag.all.each do |tag|
      if list_str.length > 0
        list_str = list_str + ", "
      end
      list_str = list_str + tag.to_s
    end
    list_str
  end
end
