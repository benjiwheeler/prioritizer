#######################################
# CANONICAL GEMS
# lives at https://gist.githubusercontent.com/brw12/d508024dcd7e230e4a88/raw/2e65efe2a145dda7ee51d1741299f848e5bf752e/Gemfile
#######################################

#######################################
# CORE SETUP
#######################
# core setup
source 'https://rubygems.org'
ruby "2.2.1"
gem 'rails', '>= 4.2'
gem 'bundler', '>= 1.8.4'
#######################
# db
gem 'pg'
gem 'redis'
#######################
# server
gem 'foreman'
gem 'unicorn'
#######################
# deployment
group :production, :staging do
  # heroku
  gem 'rails_12factor'
end
#######################

#######################################
# LANGUAGE
#######################
# css
gem 'sass-rails', '~> 4.0.3'
gem 'font-awesome-rails', '>= 4.0.0'
#######################
# view templating
gem 'haml-rails'
#######################
# Use CoffeeScript for .js.coffee assets and views
gem 'coffee-rails', '~> 4.1.0'
gem 'jquery-rails'
gem 'jquery_mobile_rails'
gem 'jquery-ui-rails'
#######################
# api
# easy to build json apis
gem 'jbuilder', '~> 2.0'
gem 'httparty'
#######################
# optimization
# makes following links in app faster
gem 'turbolinks'
# compresses javascript etc
gem 'uglifier', '>= 1.3.0'

#######################################
# DEBUGGING
#######################
# logging
gem 'quiet_assets' # less verbose logs
gem 'lograge' # less verbose logs
#######################
# inspecting
gem 'awesome_print'
gem 'solid_assert'
gem 'wrong'
gem 'newrelic_rpm'
#######################
# development
group :development do
  # inspecting
  gem "binding_of_caller"
  gem "better_errors"
  gem "rubocop"
  # debugging
  gem 'pry', group: [:development, :test]
  gem 'pry-rails', group: [:development, :test]
  gem 'pry-byebug', group: [:development, :test] # instead of pry-debugger or pry-nav
  gem 'pry-stack_explorer', group: [:development, :test]
  # Access an IRB console on exception pages or by using <%= console %> in views
  gem 'web-console', '~> 2.0'
  # profiling
  gem 'ruby-prof'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
end
#######################
# testing
group :test do
  gem 'factory_girl_rails', "~> 4.0"
end
#######################
# documentation
group :doc do
  # bundle exec rake doc:rails generates the API under doc/api.
  gem 'sdoc', require: false
end
#######################
# end of canonical



#######################################
# USUALLY NOT USED
#######################
# auth
gem "devise"
gem 'omniauth'
gem 'omniauth-facebook'
#gem 'omniauth-twitter'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'
#######################
# misc
#gem 'json'
#######################
# background processes
#gem 'sidekiq'
#gem 'sinatra', '>= 1.3.0', :require => nil
#######################
# admin
#gem 'rails_admin'
#######################
# useful apis
#gem 'twitter'
#######################
# deployment
# gem 'capistrano-rails', group: :development
#######################
# info about client
#gem 'browser'
#######################
# ASSETS: general
#######################
# hosting
# interface to aws for things like file storage
#gem 'aws-sdk'
#######################
# image hosting
#gem 'paperclip', "~> 4.1"
# rmagick i believe is an interface to imagemagick on the commandline
#gem "rmagick", :require => 'RMagick'
#######################
# interface to run command line programs, eg imagemagick (needed for rmagick above)
#gem 'cocaine', '0.3.2'
#######################
# ASSETS: rails/sprockets
#######################
# css
#gem 'bootstrap-sass', '>= 3.3'
#######################
# ASSETS: bower
#######################
# client-side versions of js packages
gem "bower-rails", "~> 0.9.2"
#######################
# Angular:
#######################
gem "angular-rails-templates"

#######################################
# this app
#######################
gem 'acts-as-taggable-on'
gem 'cocoon'
gem 'acts_as_list'
#######################
