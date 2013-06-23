require 'SrBuj/version'
require 'active_support'
require 'SrBuj/rails/generators'

module SrBuj
  module Rails
    class Engine < ::Rails::Engine
      ActiveSupport.on_load(:action_controller) do
        require 'SrBuj/rails/action_controller_helpers'
      end
    end
  end
end
