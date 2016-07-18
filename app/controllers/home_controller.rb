class HomeController < ApplicationController
  before_filter :user_must_be_logged_in!, :except => [:login]

  def index
  end

  def login
    redirect_to user_path(id: 5) # params[:user])
  end
end
