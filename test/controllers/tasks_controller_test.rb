require 'test_helper'

class TasksControllerTest < ActionController::TestCase
  setup do
    @task = tasks(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:tasks)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create task" do
    assert_difference('Task.count') do
      post :create, task: { days_imp: @task.days_imp, due: @task.due, ever_imp: @task.ever_imp, exp_dur_mins: @task.exp_dur_mins, min_dur_mins: @task.min_dur_mins, name: @task.name, notes: @task.notes, parent_id: @task.parent_id, sib_order: @task.sib_order, weeks_imp: @task.weeks_imp }
    end

    assert_redirected_to task_path(assigns(:task))
  end

  test "should show task" do
    get :show, id: @task
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @task
    assert_response :success
  end

  test "should update task" do
    patch :update, id: @task, task: { days_imp: @task.days_imp, due: @task.due, ever_imp: @task.ever_imp, exp_dur_mins: @task.exp_dur_mins, min_dur_mins: @task.min_dur_mins, name: @task.name, notes: @task.notes, parent_id: @task.parent_id, sib_order: @task.sib_order, weeks_imp: @task.weeks_imp }
    assert_redirected_to task_path(assigns(:task))
  end

  test "should destroy task" do
    assert_difference('Task.count', -1) do
      delete :destroy, id: @task
    end

    assert_redirected_to tasks_path
  end
end
