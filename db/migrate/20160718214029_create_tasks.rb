class CreateTasks < ActiveRecord::Migration
  def change
    create_table :tasks do |t|
      t.string :name
      t.text :notes
      t.datetime :due, index: true
      t.decimal :overall_imp
      t.decimal :days_imp
      t.decimal :weeks_imp
      t.decimal :ever_imp
      t.decimal :sib_order
      t.decimal :exp_dur_mins, index: true
      t.decimal :min_dur_mins, index: true

      t.timestamps null: false
    end
  end
end
