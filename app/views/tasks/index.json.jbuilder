json.tasks @ordered_tasks do |task|
  json.extract! task, :id, :name, :notes, :due, :parent_id, :vital, :immediate, :heavy, :long, :position, :exp_dur_mins, :min_dur_mins
  json.url task_url(task, format: :json)
end
