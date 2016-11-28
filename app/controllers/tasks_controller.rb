class TasksController < ApplicationController
  before_filter :user_must_be_logged_in!
  before_action :set_tag, only: [:index, :split, :show, :next, :done, :postpone, :create, :update, :worked, :split, :new]
  before_action :set_task, only: [:done, :postpone, :worked, :split, :show, :edit, :update, :destroy]
  before_action :record_significant_action, only: [:done, :postpone, :worked, :split, :create, :update, :destroy]
  before_action :record_instance_of_work, only: [:done, :worked]

  def sort
    params[:task].each_with_index do |id, index|
      Task.where(id: id).update_all(position: index+1)
    end
    render nothing: true
  end

  def next
    set_tag_menu_kind(:next)
    @task = nil
    if current_user?
      @task = TaskOrdering.get_next_task!(current_user, @tag_name)
      if @task.blank?
        respond_to do |format|
          format.html { redirect_to new_task_path(tag: @tag_name), notice: 'No more tasks; create one?' }
        end
      end
    else
      respond_to do |format|
        format.html { head :no_content, status: :unprocessable_entity }
        format.json { render json: @task.errors, status: :unprocessable_entity }
      end
    end
    # else display next task view
  end

  def done
    @task.done = true
    @task.attempts << Attempt.new(completed: true)
    respond_to do |format|
      if @task.save
        TaskOrdering.expire_redis_tasks_keys!(current_user)
        format.html { redirect_to next_task_path(tag: @tag_name), notice: 'Task was marked done.' }
        format.json do
          @ordered_tasks = TaskOrdering.n_ordered_tasks!(current_user, @tag_name)
          render :index, status: :ok
        end
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
        TaskOrdering.expire_redis_tasks_keys!(current_user)
        format.html { redirect_to next_task_path(tag: @tag_name), notice: 'Task was postponed.' }
        format.json do
          @ordered_tasks = TaskOrdering.n_ordered_tasks!(current_user, @tag_name)
          render :index, status: :ok
        end
      else
        format.html { render :new }
        format.json { render json: @task.errors, status: :unprocessable_entity }
      end
    end
  end

  def worked
    @task.attempts << Attempt.new(addressed: true)
    @task.days_imp = @task.days_imp * 0.9
    @task.days_imp = 0 if @task.days_imp < 0
    @task.weeks_imp = 0.1 + 0.9 * @task.weeks_imp
    respond_to do |format|
      if @task.save
        TaskOrdering.expire_redis_tasks_keys!(current_user)
        format.html { redirect_to next_task_path(tag: @tag_name), notice: 'Task was worked on.' }
        format.json do
          @ordered_tasks = TaskOrdering.n_ordered_tasks!(current_user, @tag_name)
          render :index, status: :ok
        end
#        format.json { render :show, status: :created, location: @task }
      else
        format.html { render :next, notice: "Couldn't update task to record work :(" }
        format.json { render json: @task.errors, status: :unprocessable_entity }
      end
    end
  end

  def split
  end

  # GET /tasks
  # GET /tasks.json
  def index
    @ordered_tasks = []
    if current_user?
      @ordered_tasks = TaskOrdering.n_ordered_tasks!(current_user, @tag_name)
      #@task = Task.new # for task form
      Rails.logger.debug("current_user: #{current_user}; ordered_tasks: #{@ordered_tasks}")
    end
  end

  # GET /task_lists
  # GET /task_lists.json
  def lists
    @task_lists = {}
    if current_user?
      current_user.tags.each do |tag|
        @task_lists[tag.name] = TaskOrdering.n_ordered_tasks!(current_user, tag.name)
      end
      # add entry for "all" tags
      @task_lists["all"] = TaskOrdering.n_ordered_tasks!(current_user, nil)
      #@task = Task.new # for task form
      Rails.logger.debug("current_user: #{current_user}; task_lists: #{@task_lists}")
    end
  end

  # GET /tasks/1
  # GET /tasks/1.json
  def show
  end

  # GET /tasks/new
  def new
    @task = Task.new
    @tags_to_display = []
    if @tag_name.present?
      @tags_to_display = [@tag_name]
    elsif current_user?
      @tags_to_display = current_user.most_likely_new_tags
    end
  end

  # GET /tasks/1/edit
  def edit
    @tags_to_display = []
    if @task.tag_list.present?
      @tags_to_display = @task.tag_list
    elsif current_user?
      @tags_to_display = current_user.most_likely_new_tags
    end
  end

  # POST /tasks
  # POST /tasks.json
  def create
    @task = Task.new(task_params)
    @task.user = current_user

    respond_to do |format|
      if @task.save
        format.html { redirect_to next_task_path(tag: @tag_name), notice: 'Task was successfully created.' }
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
        format.html { redirect_to next_task_path(tag: @tag_name), notice: 'Task was successfully updated.' }
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
      format.json {
        if current_user?
          @ordered_tasks = TaskOrdering.n_ordered_tasks!(current_user, @tag_name)
          render :index, status: :ok
        else
          render :no_content
        end
      }
    end
  end

private
  # Use callbacks to share common setup or constraints between actions.
  def set_tag
    @tag = nil
    @tag_name = nil
    if params[:tag].present?
      @tag = ActsAsTaggableOn::Tag.find_by(name: params[:tag])
      if @tag.present?
        @tag_name = @tag.name
      end
    end
  end

  def set_task
    @task = Task.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def task_params
    # note that children do NOT have:
    # * is_daily
    good_params = params.require(:task).permit(:id, :name, :notes, :due, :time_of_day, \
      :parent_id, :vital, :immediate, :heavy, :long, :position, :exp_dur_mins, :min_dur_mins, \
      :is_daily, tag_list: [], \
      :children_attributes => [:id, :name, :notes, :due, :time_of_day, :parent_id, \
      :vital, :immediate, :heavy, :long, :position, :exp_dur_mins, :min_dur_mins, tag_list: []])

    # need to convert tome_of_day from string to num seconds
    if good_params.has_key? :time_of_day
      good_params[:time_of_day] = Task.time_param_to_num_secs(good_params[:time_of_day])
    end
    if good_params.has_key? :children_attributes
      good_params[:children_attributes].each do |child_key, child_params|
        if good_params[:children_attributes][child_key].has_key? :time_of_day
          good_params[:children_attributes][child_key][:time_of_day] = \
            Task.time_param_to_num_secs(good_params[:children_attributes][child_key][:time_of_day])
        end
      end
    end
    return good_params
  end

end
