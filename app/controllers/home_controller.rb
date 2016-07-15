class HomeController < ApplicationController
  before_filter :user_must_be_logged_in!, :except => [:login]

  def index
  end

  def login
  end
end
