# frozen_string_literal: true

require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Fms
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    # For QR Code, I added the line written below (Guided by ChatGPT)
    config.action_controller.default_url_options = { host: 'your_actual_host', port: 'your_actual_port' }

    # Following work is done for excel sheet (To display data in excel sheet)
    # To export Excel Sheet, I added the line written below (Guided by ChatGPT)
    Mime::Type.register 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', :xlsx
    # Ye upar wala kaam excel sheet k liye

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")
  end
end
