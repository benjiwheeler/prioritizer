require File.expand_path('../boot', __FILE__)

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

# Invokes rake bower:resolve before precompilation. Defaults to false
BowerRails.configure do |bower_rails|
  bower_rails.resolve_before_precompile = true
end

module Prioritizer
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    # Do not swallow errors in after_commit/after_rollback callbacks.
    config.active_record.raise_in_transactional_callbacks = true

    config.hardcoded_current_user_key = nil

    # load custom modules
    config.autoload_paths << File.join(Rails.root, "lib", "classes")
    config.autoload_paths << File.join(Rails.root, "lib", "modules")

    #config.assets.paths << File.join(Rails.root, "lib", “assets")
    #config.assets.paths << File.join(Rails.root, “vendor", “assets")
    end
end

