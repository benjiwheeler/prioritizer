class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def all_providers
    [:twitter, :facebook]
  end
  def user_must_exist!
    ensure_user
    redirect_to login_path unless current_user?
  end
  def user_must_be_logged_in!
    if !logged_in?
      if current_user_is_dev?
        # do nothing
      else
        # NOTE: temporarily disabled
        #redirect_to login_path
      end
    end
  end

protected
  def current_user
    @current_user ||= User.find_by_id(session[:user_id])
    # allow user to be hardcoded in development
    if @current_user.nil? \
        && defined?(Rails.configuration.hardcoded_current_user_key) \
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
    if @current_user.present? \
        && defined?(Rails.configuration.hardcoded_current_user_key) \
        && Rails.configuration.hardcoded_current_user_key.present? \
        && @current_user == User.find_by(key: Rails.configuration.hardcoded_current_user_key)
      true
    else
      false
    end
  end
  def logged_in?
    # was:
    # current_user != nil && current_user.registered?
    @current_user_from_session_debug = User.find_by_id(session[:user_id])
    @current_user_debug = current_user
    @current_user_found_debug = current_user?
    @current_user_registered_debug = current_user.registered?
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
  def get_session_token
    ensure_user
    session[:user_id]
  end
  helper_method :all_providers, :user_must_exist!, :user_must_be_logged_in, :current_user, :current_user?, :ensure_user, :create_guest, :logged_in?, :set_current_user, :set_current_user_with_merge, :set_user_id_str, :user_id_str, :get_session_token

  # handle failure of csrf authenticity token, per
  # https://technpol.wordpress.com/2014/04/17/rails4-angularjs-csrf-and-devise/
  rescue_from ActionController::InvalidAuthenticityToken do |exception|
    # should reenable this:sign_out(current_user)
    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
    render :error => 'invalid token', :status => :unprocessable_entity
  end
end
