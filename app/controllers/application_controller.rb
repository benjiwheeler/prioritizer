class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  ############################################################
  #                    Auth
  ############################################################

  def all_providers
    [:twitter, :facebook]
  end

  ############################################################
  #                    Practical Session
  ############################################################

  # need a complete break of this long to reset session
  def session_timeout_seconds
    60 * 60 * 0.5
  end

  # always know how long it's been since a significant action
  # not really used at the moment
  def record_significant_action
    cookies[:last_significant_action_secs] = { value: Time.now.to_i, expires: 1.hours.from_now }
  end

  # not really used at the moment
  def secs_since_significant_action
    ret_val = 86400 # large num
    if cookies[:last_significant_action_secs].present?
      ret_val = Time.now.to_i - cookies[:last_significant_action_secs].to_i
    end
    return ret_val
  end

  # not really used at the moment
  def is_new_practical_session
    secs_since_significant_action > SESSION_TIMEOUT_SECONDS
  end

  # always know how many times we've achieved work in this session
  def num_work_instances_in_session
    @num_work_instances_in_session ||= 0
    if @num_work_instances_in_session.blank? && cookies[:num_work_instances_in_session].present?
      @num_work_instances_in_session = cookies[:num_work_instances_in_session].to_f
    end
    return @num_work_instances_in_session
  end

  # always know how many times we've achieved work in this session
  def set_num_work_instances_in_session(new_val)
    cookies[:num_work_instances_in_session] = { value: new_val, expires: session_timeout_seconds.seconds.from_now }
    @num_work_instances_in_session = new_val
  end

  # always know how many times we've achieved work in this session
  def record_instance_of_work
    set_num_work_instances_in_session(num_work_instances_in_session + 1)
  end

  ############################################################
  #                    Tag menu
  ############################################################

public
  def set_tag_menu_kind(new_kind) # [:list, :next]
    @tag_menu_kind = new_kind
    end
  def tag_menu_kind
    @tag_menu_kind ||= :list
  end
  def tag_menu_tag_link_path(tag_name)
    case tag_menu_kind
    when :list
     tasks_path(tag: tag_name)
    when :next
     next_task_path(tag: tag_name)
   else
     tasks_path(tag: tag_name)
   end
  end

  ############################################################
  #                    Login-related
  ############################################################

public
  def user_must_exist!
    ensure_user
    redirect_to login_path unless current_user?
  end
  def user_must_be_logged_in!
    if !logged_in?
      if current_user_is_dev?
        # do nothing
      else
        # NOTE: was temporarily disabled
        redirect_to login_path
      end
    end
  end

protected
  def current_user
    @current_user ||= User.find_by_id(cookies[:user_id])
    # allow user to be hardcoded in development
    if @current_user.nil? \
        && Rails.configuration.hardcoded_current_user_key.present?
      hardcoded_user = User.find_by(key: Rails.configuration.hardcoded_current_user_key)
      set_current_user(hardcoded_user)
    end
    @current_user
  end

  def current_user?
    current_user != nil
  end

  def current_user_is_dev?
    if current_user.present? \
        && Rails.configuration.hardcoded_current_user_key.present? \
        && current_user == User.find_by(key: Rails.configuration.hardcoded_current_user_key)
      true
    else
      false
    end
  end
  def logged_in?
    # was:
    # current_user != nil && current_user.registered?
    @tempname_cookie_val = cookies["tempname"]
    @current_session_user_id_debug = session[:user_id]
    @current_user_from_session_debug = User.find_by_id(session[:user_id])
    @current_user_from_cookie_debug = User.find_by_id(cookies[:user_id])
    @current_user_debug = current_user
    @current_user_found_debug = current_user?
    @current_user_registered_debug = current_user? && current_user.registered?
    current_user? && current_user.registered?
  end
  def create_guest
    set_current_user(User.create_guest)
  end
  def ensure_user
    current_user? || create_guest
  end
  def set_current_user(user)
    session[:user_id] = user.id
    cookies[:user_id] = { value: user.id, expires: 30.days.from_now }
    @current_user = user
  end
  def set_current_user_with_merge(other_user)
    assert(other_user.present?)
    base_user = User.merge_users(current_user, other_user)
    set_current_user(base_user)
  end
  def set_user_id_str
    if current_user?
      @user_id_str = current_user.id.to_s
    else
      @user_id_str = "guest"
    end
  end
  def user_id_str
    @user_id_str ||= set_user_id_str
  end

  ############################################################
  #                    Security
  ############################################################

  # handle failure of csrf authenticity token, per
  # https://technpol.wordpress.com/2014/04/17/rails4-angularjs-csrf-and-devise/
  rescue_from ActionController::InvalidAuthenticityToken do |exception|
    # should reenable this:sign_out(current_user)
    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
    render :error => 'invalid token', :status => :unprocessable_entity
  end


  ############################################################
  #                    Expose helper functions
  ############################################################

  helper_method :all_providers, :user_must_exist!, :user_must_be_logged_in, :current_user, :current_user?, :ensure_user, :create_guest, :logged_in?, :set_current_user, :set_current_user_with_merge, :set_user_id_str, :user_id_str, :record_significant_action, :tag_menu_kind, :set_tag_menu_kind, :tag_menu_tag_link_path

end
