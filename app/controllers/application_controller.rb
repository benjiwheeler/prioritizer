class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def user_must_be_logged_in!
    redirect_to home_login_path unless signed_in?
  end
protected
#  def current_user
#    @current_user ||= User.find_by_id(session[:user_id])
#  end
#  def signed_in?
#    !!current_user
#  end
#  helper_method :current_user, :signed_in?
#  def current_user=(user)
#    @current_user = user
#    session[:user_id] = user.id
#  end
end
