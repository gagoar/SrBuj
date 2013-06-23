module SrBuj
  module Generators
    class Install < Rails::Generators::Base
       desc "This generator installs SrBuj #{SrBuj::VERSION} in your manifests (js/css)"

      def add_assets
        [ detect_js_format, detect_css_format ].each do |format, prepend, type|
          say_status("inserting", "SrBuj (#{SrBuj::VERSION}) in your application#{format}", :green)
          insert_into_file "app/assets/#{type}/application#{format}", "#{prepend} require SrBuj\n", after: "jquery_ujs\n"
        end
      end

      def detect_js_format
        [['.js.coffee', '#='], ['.js', '//=']].each do  |format, prepend|
          return [format, prepend, 'javascripts'] if File.exist?("app/assets/javascripts/application#{format}")
        end
      end

      def detect_css_format
        return ['.css', ' *=', 'stylesheets'] if File.exist?('app/assets/stylesheets/application.css')

        ['.sass', '.scss'].each do |format|
         return [ format, '//=', 'stylesheets' ] if File.exist?("app/assets/stylesheets/application#{format}")
         return [ ".css#{format}", '//=', 'stylesheets' ] if File.exist?("app/assets/stylesheets/application.css#{format}")
        end
      end
    end
  end
end
