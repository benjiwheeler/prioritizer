json.array!(@attempts) do |attempt|
  json.extract! attempt, :id, :task_id, :completed, :progress, :snoozed, :rescheduled, :split, :addressed, :target_dur_mins, :actual_dur_mins
  json.url attempt_url(attempt, format: :json)
end
