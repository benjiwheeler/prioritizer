require 'date'

class Task < ActiveRecord::Base
  belongs_to :user
  has_many :attempts, dependent: :destroy
  belongs_to :parent, class_name: "Task", foreign_key: "parent_id", inverse_of: :children
  has_many :children, -> { order(position: :asc) }, class_name: "Task", foreign_key: "parent_id", inverse_of: :parent
  accepts_nested_attributes_for :children
  acts_as_taggable
  acts_as_list
  attr_accessor :overall_imp_alone # don't persist this to db, just use for sorting
  attr_accessor :session_rand # don't persist this to db, just use for sorting
  attr_accessor :overall_ease # don't persist this to db, just use for sorting
  attr_accessor :session_bonus # don't persist this to db, just use for sorting
  before_save :before_save_steps
  after_save :after_save_steps

  def Task.NUM_SECONDS_UNTIL_RAND_EXPIRES
    60 * 60
  end

  def Task.unit_scale_log_val(raw_val, expected_mean, halflife)
    diff_from_mean = raw_val - expected_mean
    sign = diff_from_mean < 0 ? -1.0 : 1.0
    return sign * (1.0 - halflife/(diff_from_mean.abs + halflife))
  end

  def to_s
    "id #{self.id}: #{self.name}"
  end

  def user_to_s
    if self.user.present?
      self.user.to_s
    else
      "Missing User"
    end
  end

  def Task.attributes_influencing_order
    ["done", "due", "time_of_day", "vital", "immediate", "heavy", "long", "exp_dur_mins", "min_dur_mins", "position"]
  end

  def Task.postpone_size_s
    60 * 60 * 24
  end

  def Task.attempt_typical_extension
    60 * 60 * 24
  end

  def Task.default_imp
    0.25
  end

  def time_of_day_s
    if self.time_of_day.present?
      Time.at(self.time_of_day).utc.strftime("%I:%M %p")
    else
      ""
    end
  end

  def Task.time_param_to_num_secs(time_param)
    if time_param.class == String
      # DateTime.parse throws ArgumentError if it can't parse the string
      if dt = DateTime.parse(time_param) rescue false
        seconds = dt.hour * 3600 + dt.min * 60 #=> 37800
      end
      return seconds.to_i
    elsif time_param.is_a? Numeric # if we got # hours, convert to seconds
      if time_param > 0 && time_param <= 24
        time_param *= 3600
      end
    end
    return time_param
  end

  def before_save_steps
    if self.parent.present? && self.parent.user.present?
      self.user = self.parent.user
      Rails.logger.warn "Using parent user for task #{self.name}"
    else
      Rails.logger.warn "Can't useparent's user for task #{self.name} because user could not be gotten from parent"
    end
    self.set_default_imps!
    # if we have changed attributes that influence importance, clear importance cache
    if (Task.attributes_influencing_order & self.changed).present?
      # invalidate user's cached task importance listing
      TaskOrdering.expire_redis_tasks_keys!(user)
      Rails.logger.warn "Before saving task, User #{self.user_to_s} tasks cache expired"
    else
      Rails.logger.warn "Before saving task, User #{self.user_to_s} tasks cache not expired"
    end
  end

  def after_save_steps
  end

  def set_default_imps!
    if self.days_imp.nil?
      self.days_imp = Task.default_imp
    end
    if self.weeks_imp.nil?
      self.weeks_imp = Task.default_imp
    end
    if self.ever_imp.nil?
      self.ever_imp = Task.default_imp
    end
    if self.vital.nil?
      self.vital = Task.default_imp
    end
    if self.immediate.nil?
      self.immediate = Task.default_imp
    end
    if self.heavy.nil?
      self.heavy = Task.default_imp
    end
    if self.long.nil?
      self.long = Task.default_imp
    end
  end

  def attempts_report_done?
    self.attempts.order(created_at: :desc).each do |att|
      if att.completed == true
        return true
      end
    end
    return false
  end

  def attempts_report_done_amount
    if self.attempts_report_done?
      -1.0
    else
      0.0
    end
  end

  def raw_position_amount
    if self.position.present?
      return 0
# reenable when i fix position! now the positions are all over the place...
#      return 0.1 - 0.1 * self.position
    else
      return 0
    end
  end


  def position_amount
    my_raw_position_amount = raw_position_amount
    parent_position_amount = 0
    if self.parent.present?
      parent_position_amount = self.parent.position_amount
    end
    return my_raw_position_amount + parent_position_amount
  end


  def postponed_recently_amount
    has_not_postponed = 1.0
    # we look at each addressed record, and exponentially decrease our sense that we
    # have not addressed this
    self.attempts.order(created_at: :desc).each do |att|
      if att.snoozed == true
        age_in_s = Time.now - att.updated_at
        # age_score is small for recent snoozes,
        # large (thus insignificant) for old ones
        age_score = Task.unit_scale_log_val(age_in_s, 0, Task.postpone_size_s)
        has_not_postponed = has_not_postponed * age_score
      end
    end
    return has_not_postponed - 1.0
  end

  def addressed_recently_amount
    has_not_addressed = 1.0
    # we look at each addressed record, and exponentially decrease our sense that we
    # have not addressed this
    self.attempts.order(created_at: :desc).each do |att|
      if att.addressed == true
        age_in_s = Time.now - att.updated_at
        # age_score is small for recent attempts,
        # large (thus insignificant) for old ones
        age_score = Task.unit_scale_log_val(age_in_s, 0, Task.attempt_typical_extension)
        has_not_addressed = has_not_addressed * age_score
      end
    end
    return has_not_addressed - 1.0
  end

  ############################################################
  #                Overall importance
  ############################################################

  def calc_overall_imp_alone
    imp = 0.25
    num_fields = 0
    if !self.vital.nil?
      imp += self.vital / 10.0
      num_fields = num_fields + 1.0
    end
    if !self.immediate.nil?
      imp += self.immediate / 10.0
      num_fields = num_fields + 1.0
    end
    if num_fields > 0
      imp = imp / (num_fields + 0.00001)
    end
    imp += self.attempts_report_done_amount
    imp += self.postponed_recently_amount
    imp += self.addressed_recently_amount
    imp += self.position_amount
    return imp
  end

  def generate_overall_imp_alone!
    @overall_imp_alone = self.calc_overall_imp_alone
  end

  def get_overall_imp_alone!
    if @overall_imp_alone.nil?
      self.generate_overall_imp_alone!
    end
    @overall_imp_alone
  end

  ############################################################
  #                Overall ease
  ############################################################

  def calc_overall_ease
    ease = 0.25
    num_fields = 0
    if !self.heavy.nil?
      ease += 1.0 - (self.heavy / 10.0)
      num_fields = num_fields + 1.0
    end
    if !self.long.nil?
      ease += 1.0 - (self.long / 10.0)
      num_fields = num_fields + 1.0
    end
    if num_fields > 0
      ease = ease / (num_fields + 0.00001)
    end
    return ease
  end

  def generate_overall_ease!
    @overall_ease = self.calc_overall_ease
  end

  def get_overall_ease!
    if @overall_ease.nil?
      self.generate_overall_ease!
    end
    @overall_ease
  end

  ############################################################
  #                Random factor
  ############################################################

  def calc_session_rand
    # seed rand with current time and this id
    nowSec = Time.now.to_i
    randSeed = (nowSec / (Task.NUM_SECONDS_UNTIL_RAND_EXPIRES + 0.0001)).truncate
    if self.id.present?
      randSeed += self.id.to_i
    end
    srand randSeed

    rand_float = rand
    # (rand_float * rand_float * rand_float * 0.25):
    # 25th percentile: 0%
    # 50th percentile: 3%
    # 75th percentile: 10%
    # max: 25%
    # then subtract median of 3%, making:
    # 25th percentile: -3%
    # 50th percentile: 0%
    # 75th percentile: 7%
    # max: 22%
    return rand_float * rand_float * rand_float * 0.25 - 0.03
  end

  def generate_session_rand!
    @session_rand = self.calc_session_rand
  end

  def get_session_rand!
    if @session_rand.nil?
      self.generate_session_rand!
    end
    @session_rand
  end

  ############################################################
  #                Bonus
  ############################################################

  def session_bonus_with_default
    @session_bonus ||= 0
  end

  def add_session_bonus(bonus_delta)
    @session_bonus ||= 0
    @session_bonus += bonus_delta
  end


  ############################################################
  #                Ancestry and Descendence
  ############################################################


  def oldest_ancestor
    if self.parent.present?
      self.parent.oldest_ancestor
    else
      self
    end
  end

  def first_youngest_descendent(withAttributes = {})
    # if there is an even "younger" (ie, deeper) descendent with right attributes,
    # return that.
    # else, if i match, return me.
    # else return nil.
    # find the first child with a valid descendent,
    # return first such descendent we find.
    # NOTE: this should be redone to balance
    # postponed state, order, simplicity, etc.
    self.children.each do |child|
      this_child_youngest_descendent_with_attributes = child.first_youngest_descendent(withAttributes)
      if this_child_youngest_descendent_with_attributes.present?
        return this_child_youngest_descendent_with_attributes
      end
    end
    # if we're still here, we didn't find a valid
    # descendent. so,
    # check if this one matches withAttributes
    i_match_attributes = true
    withAttributes.each do |key, val|
      if self.has_attribute?(key) && self[key] != val
        i_match_attributes = false
        break
      end
    end
    # now i_match_attributes is set right
    if i_match_attributes
      return self
    else
      return nil
    end
  end

  def first_task_in_family_tree(withAttributes = {})
    self.oldest_ancestor.first_youngest_descendent(withAttributes)
  end
end
