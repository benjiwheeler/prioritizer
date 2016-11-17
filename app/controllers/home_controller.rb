# HomeController
class HomeController < ApplicationController
  before_filter :user_must_be_logged_in!, except: [:login]

  def index
    #    redirect_to tasks_path
    #    redirect_to spa_path
  end

  def login
  end
end
