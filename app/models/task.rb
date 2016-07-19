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
    imp = -1
    imp += self.days_imp
    imp += self.weeks_imp
    imp += self.ever_imp
    if imp == -1
      imp = 0.5
    end
    imp / 3.0
  end

  def generate_importance!
    self.overall_imp = self.calc_importance
    self.save
  end

  def Task.random_score
    rand(1000) * 0.00001
  end
end
