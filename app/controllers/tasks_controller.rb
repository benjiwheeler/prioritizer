class TasksController < ApplicationController
  before_filter :user_must_be_logged_in!
  before_action :set_tag, only: [:index, :split, :show, :next]
  before_action :set_task, only: [:done, :postpone, :worked, :split, :show, :edit, :update, :destroy]

  def sort
    params[:task].each_with_index do |id, index|
      Task.where(id: id).update_all(position: index+1)
    end
    render nothing: true
  end

  def next
    @task = current_user.get_next_task!(index_params[:tag])
    if @task.blank?
      respond_to do |format|
        format.html { redirect_to :new_task, notice: 'No more tasks; create one?' }
      end
    end
    # else display next task view
  end

  def done
    @task.done = true
    @task.attempts << Attempt.new(completed: true)
    respond_to do |format|
      if @task.save
        format.html { redirect_to :next_task, notice: 'Task was marked done.' }
      else
        format.html { render :edit }
        format.json { render json: @task.errors, status: :unprocessable_entity }
      end
    end
  end

  def postpone
    @task.attempts << Attempt.new(snoozed: true)
    @task.days_imp -= 0.1
    @task.days_imp = 0 if @task.days_imp < 0
    @task.weeks_imp += 0.1
    @task.weeks_imp = 1.0 if @task.weeks_imp > 1.0
    respond_to do |format|
      if @task.save
        format.html { redirect_to :next_task, notice: 'Task was postponed.' }
        format.json { render :show, status: :created, location: @task }
      else
        format.html { render :new }
        format.json { render json: @task.errors, status: :unprocessable_entity }
      end
    end
  end

  def worked
    @task.attempts << Attempt.new(snoozed: true)
    @task.days_imp -= 0.1
    @task.days_imp = 0 if @task.days_imp < 0
    @task.weeks_imp += 0.1
    @task.weeks_imp = 1.0 if @task.weeks_imp > 1.0
    respond_to do |format|
      if @task.save
        format.html { redirect_to :next_task, notice: 'Task was postponed.' }
        format.json { render :show, status: :created, location: @task }
      else
        format.html { render :new }
        format.json { render json: @task.errors, status: :unprocessable_entity }
      end
    end
  end

  def split
  end

  # GET /tasks
  # GET /tasks.json
  def index
    @ordered_tasks = current_user.n_ordered_tasks!(index_params[:tag])
    @task = Task.new # for task form
    Rails.logger.debug("current_user: #{current_user}; ordered_tasks: #{@ordered_tasks}")
  end

  # GET /tasks/1
  # GET /tasks/1.json
  def show
  end

  # GET /tasks/new
  def new
    @task = Task.new
  end

  # GET /tasks/1/edit
  def edit
  end

  # POST /tasks
  # POST /tasks.json
  def create
    @task = Task.new(task_params)
    @task.user = current_user

    respond_to do |format|
      if @task.save
        format.html { redirect_to :next_task, notice: 'Task was successfully created.' }
        format.json { render :show, status: :created, location: @task }
      else
        format.html { render :new }
        format.json { render json: @task.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /tasks/1
  # PATCH/PUT /tasks/1.json
  def update
    respond_to do |format|
      if @task.update(task_params)
        format.html { redirect_to :next_task, notice: 'Task was successfully updated.' }
        format.json { render :show, status: :ok, location: @task }
      else
        format.html { render :edit }
        format.json { render json: @task.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /tasks/1
  # DELETE /tasks/1.json
  def destroy
    @task.destroy
    respond_to do |format|
      format.html { redirect_to tasks_url, notice: 'Task was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

private
  # Use callbacks to share common setup or constraints between actions.
  def set_tag
    @tag = nil
    if params[:tag].present?
      @tag = ActsAsTaggableOn::Tag.find_by(name: params[:tag])
    end
  end

  def set_task
    @task = Task.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def task_params
    params.require(:task).permit(:id, :name, :notes, :due, :parent_id, :days_imp, :weeks_imp, :ever_imp, :position, :exp_dur_mins, :min_dur_mins, tag_list: [],
     :children_attributes => [:id, :name, :notes, :due, :parent_id, :days_imp, :weeks_imp, :ever_imp, :position, :exp_dur_mins, :min_dur_mins, tag_list: []])
  end

  def index_params
    params.permit(:tag)
  end
end
