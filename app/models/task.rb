class Task < ActiveRecord::Base
  belongs_to :user
  has_many :attempts, dependent: :destroy
  belongs_to :parent, class_name: "Task", foreign_key: "parent_id", inverse_of: :children
  has_many :children, class_name: "Task", foreign_key: "parent_id", inverse_of: :parent
  acts_as_taggable

  def Task.random_score
    rand(1000) * 0.00001
  end
end
