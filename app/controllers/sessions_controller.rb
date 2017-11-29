class SessionsController < ApplicationController

  def destroy
    session[:user_id] = nil
    cookies[:user_id] = nil
    redirect_to root_url
  end

  def login # as in show login, not perform login
    # don't worry here about ensuring user not logged in, assume that's taken care of
    if current_user.present?
      redirect_to "#/tasks" #tasks_path(current_user) # params[:user])
    end
  end

end
