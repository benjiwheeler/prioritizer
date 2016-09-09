class Task < ActiveRecord::Base
  belongs_to :user
  has_many :attempts, dependent: :destroy
  belongs_to :parent, class_name: "Task", foreign_key: "parent_id", inverse_of: :children
  has_many :children, -> { order(position: :asc) }, class_name: "Task", foreign_key: "parent_id", inverse_of: :parent
  accepts_nested_attributes_for :children
  acts_as_taggable
  acts_as_list
  before_save :before_save_steps
  after_save :after_save_steps

  def Task.unit_scale_log_val(raw_val, expected_mean, halflife)
    diff_from_mean = raw_val - expected_mean
    sign = diff_from_mean < 0 ? -1.0 : 1.0
    return sign * (1.0 - halflife/(diff_from_mean.abs + halflife))
  end

  def user_to_s
    if self.user.present?
      self.user.to_s
    else
      "Missing User"
    end
  end

  def Task.attributes_influencing_imp
    ["done", "due", "overall_imp", "days_imp", "weeks_imp", "ever_imp", "exp_dur_mins", "min_dur_mins", "position", ]
  end

  def Task.postpone_size_s
    60 * 60 * 24
  end

  def Task.attempt_typical_extension
    60 * 60 * 24 * 5
  end

  def Task.default_imp
    0.25
  end

  def before_save_steps
    if self.parent.present? && self.parent.user.present?
      self.user = self.parent.user
      Rails.logger.warn "Using parent user for task #{self.name}"
    else
      Rails.logger.warn "Can't useparent's user for task #{self.name} because user could not be gotten from parent"
    end
    self.set_default_imps
    self.generate_importance
    # if we have changed attributes that influence importance, clear importance cache
    if (Task.attributes_influencing_imp & self.changed).present?
      # invalidate user's cached task importance listing
      self.user.expire_redis_tasks_keys!
      Rails.logger.warn "After saving task, User #{self.user_to_s} tasks cache expired"
    else
      Rails.logger.warn "After saving task, User #{self.user_to_s} tasks cache not expired"
    end
  end

  def after_save_steps

  end

  def set_default_imps
    if self.days_imp.nil?
      self.days_imp = Task.default_imp
    end
    if self.weeks_imp.nil?
      self.weeks_imp = Task.default_imp
    end
    if self.ever_imp.nil?
      self.ever_imp = Task.default_imp
    end
  end


  def random_amount
    rand_float = rand
    # (rand_float * rand_float * 0.25):
    # 25th percentile: 2%
    # 50th percentile: 6%
    # 75th percentile: 14%
    # max: 25%
    # then subtract median of 6%, making:
    # 25th percentile: -5%
    # 50th percentile: 0%
    # 75th percentile: 8%
    # max: 19%
    return rand_float * rand_float * 0.25 - 0.0625
  end

  def attempts_report_done?
    self.attempts.order(created_at: :desc).each do |att|
      if att.completed == true
        return true
      end
    end
    return false
  end

  def postponed_recently_amount
    self.attempts.order(created_at: :desc).each do |att|
      if att.snoozed == true
        age_in_s = Time.now - att.updated_at
        if age_in_s < Task.postpone_size_s
          return -0.5
        end
      end
    end
    return 0
  end

  def addressed_recently_amount
    has_not_addressed = 1.0
    # we only look at one addressed record, the latest one
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

  def get_importance!
    if self.overall_imp.nil?
      self.generate_importance!
    end
    self.overall_imp
  end

  def calc_importance
    imp = 0.25
    num_fields = 0
    if !self.days_imp.nil?
      imp += self.days_imp
      num_fields = num_fields + 1.0
    end
    if !self.weeks_imp.nil?
      imp += self.weeks_imp
      num_fields = num_fields + 1.0
    end
    if !self.ever_imp.nil?
      imp += self.ever_imp
      num_fields = num_fields + 1.0
    end
    if num_fields > 0
      imp = imp / (num_fields + 0.00001)
    end
    imp -= 1.0 if self.attempts_report_done?
    imp += self.postponed_recently_amount
    imp += self.addressed_recently_amount
    return imp
  end

  def generate_importance
    self.overall_imp = self.calc_importance
  end

  def generate_importance!
    old_imp = self.overall_imp
    new_imp = self.generate_importance
    if old_imp != new_imp
      self.save
    end
  end

  def Task.random_score
    rand(1000) * 0.00001
  end

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
    younger_descendent_with_attributes = nil
    if self.children.count > 0
      younger_descendent_with_attributes = self.children.first.first_youngest_descendent(withAttributes)
    end
    if younger_descendent_with_attributes.present?
      return younger_descendent_with_attributes
    else
      # check if matches withAttributes
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
  end

  def first_task_in_family_tree(withAttributes = {})
    self.oldest_ancestor.first_youngest_descendent(withAttributes)
  end
end
