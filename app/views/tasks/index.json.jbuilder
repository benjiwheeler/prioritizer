json.array!(@tasks) do |task|
  json.extract! task, :id, :name, :notes, :due, :parent_id, :days_imp, :weeks_imp, :ever_imp, :sib_order, :exp_dur_mins, :min_dur_mins
  json.url task_url(task, format: :json)
end
