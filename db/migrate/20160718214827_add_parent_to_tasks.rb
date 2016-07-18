class AddParentToTasks < ActiveRecord::Migration
  def change
    add_reference :tasks, :parent, references: :tasks, index: true
    add_foreign_key :tasks, :tasks, column: :parent_id
  end
end
