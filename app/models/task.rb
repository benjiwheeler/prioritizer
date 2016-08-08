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

  def Task.attributes_influencing_imp
    ["done", "due", "overall_imp", "days_imp", "weeks_imp", "ever_imp", "exp_dur_mins", "min_dur_mins", "position", ]
  end

  def Task.postpone_size_s
    7200
  end

  def Task.default_imp
    0.25
  end

  def before_save_steps
    self.set_default_imps
    self.generate_importance
    # if we have changed attributes that influence importance, clear importance cache
    if (Task.attributes_influencing_imp & self.changed).present?
      # invalidate user's cached task importance listing
      self.user.expire_redis_tasks_keys!
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

  # unused
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
    imp -= 1.0 if self.attempts_report_done
    imp += self.postponed_recently_amount
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

  def first_youngest_descendent
    if self.children.count > 0
      self.children.first.first_youngest_descendent
    else
      self
    end
  end

  def first_task_in_family_tree
    self.oldest_ancestor.first_youngest_descendent
  end
end
