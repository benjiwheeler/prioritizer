class AddTimeOfDayToTasks < ActiveRecord::Migration
  def change
    add_column :tasks, :time_of_day, :integer, default: 32400
    add_column :tasks, :is_daily, :boolean, default: false
  end
end
