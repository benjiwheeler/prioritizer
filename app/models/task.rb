class Task < ActiveRecord::Base
  belongs_to :user
  has_many :attempts, dependent: :destroy
  belongs_to :parent, class_name: "Task", foreign_key: "parent_id", inverse_of: :children
  has_many :children, class_name: "Task", foreign_key: "parent_id", inverse_of: :parent
  acts_as_taggable

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
    return imp
  end

  def generate_importance!
    self.overall_imp = self.calc_importance
    self.save
  end

  def Task.random_score
    rand(1000) * 0.00001
  end
end
