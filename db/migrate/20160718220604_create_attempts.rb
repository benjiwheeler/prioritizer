class CreateAttempts < ActiveRecord::Migration
  def change
    create_table :attempts do |t|
      t.references :task, index: true, foreign_key: true
      t.boolean :completed, index: true
      t.decimal :progress
      t.boolean :snoozed
      t.boolean :rescheduled
      t.boolean :split, index: true
      t.boolean :addressed, index: true
      t.decimal :target_dur_mins
      t.decimal :actual_dur_mins

      t.timestamps null: false
    end
  end
end
