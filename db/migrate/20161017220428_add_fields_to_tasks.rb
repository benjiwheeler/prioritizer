class AddFieldsToTasks < ActiveRecord::Migration
  def change
    add_column :tasks, :vital, :decimal
    add_column :tasks, :immediate, :decimal
    add_column :tasks, :heavy, :decimal
    add_column :tasks, :long, :decimal
  end
end
