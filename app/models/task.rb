class Task < ActiveRecord::Base
  belongs_to :user
  has_many :attempts, dependent: :destroy
  belongs_to :parent, class_name: "Task", foreign_key: "parent_id", inverse_of: :children
  has_many :children, -> { order(position: :asc) }, class_name: "Task", foreign_key: "parent_id", inverse_of: :parent
  accepts_nested_attributes_for :children
  acts_as_taggable
  acts_as_list
  before_save :before_save_steps

  def Task.postpone_size_s
    7200
  end

  def Task.default_imp
    0.25
  end

  def before_save_steps
    self.set_default_imps
    self.generate_importance
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

  def is_done?
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
    imp -= 1.0 if self.is_done?
    imp += self.postponed_recently_amount
    return imp
  end

  def generate_importance
    self.overall_imp = self.calc_importance
  end

  def generate_importance!
    self.generate_importance
    self.save
  end

  def Task.random_score
    rand(1000) * 0.00001
  end
end
