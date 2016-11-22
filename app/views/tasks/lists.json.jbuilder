json.tags do
  @task_lists.each do |tag_name, task_arr|
    json.set! tag_name do
      json.array! task_arr do |task|
        json.extract! task, :id, :name, :notes, :due, :parent_id, :vital, :immediate, :heavy, :long, :position, :exp_dur_mins, :min_dur_mins
        json.url task_url(task, format: :json)
        json.tags task.tags do |tag|
          json.extract! tag, :id, :name
        end
      end
    end
  end
end
