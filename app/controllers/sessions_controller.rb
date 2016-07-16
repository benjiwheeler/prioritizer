class SessionsController < ApplicationController

  def destroy
    session[:user_id] = nil
    redirect_to root_url
  end

  def login # as in show login, not perform login
    # don't worry here about ensuring user not logged in, assume that's taken care of
  end

end