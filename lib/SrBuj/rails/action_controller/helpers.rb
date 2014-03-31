module SrBuj
  module ActionController
    module Helpers
      HEADERS = {
        message: 'X-SRBUJ-MSG',
        type: 'X-SRBUJ-TYPE',
        side: 'X-SRBUJ-SIDE',
        position: 'X-SRBUJ-POS',
        time: 'X-SRBUJ-TIME'
      }
      #=> helpfull method to return redirect_to in an js way.
      # use: js_redirect(to: root_path)
      # use: js_redirect(reload: true)
      def js_redirect(opts = {})
        js = if defined? opts[:to]
               "window.location.href = '#{opts[:to]}';"
             elsif defined? opts[:reload]
               "window.location.reload();"
             end
        render js: js
      end

      #=> this method sets 2 simple headers to be handled (later on) for the SrBuj respond librery in js.
      # the :type attribute could be any css class that you need to append
      # options:
      # type: [error, info, warning] or any other class (the first 3 clases are going to be used as alert-error, alert-info and alert-warning)
      # side: [right, left] wich side the message will appear
      # position: [top, bottom]
      # time: [numeric] will change the time that the message will be displayed
      # use: js_notify (message: 'this is madness!', type: 'error', side: 'right', position: 'top', time: 2000 )
      def js_notify(options = {})
        if options[:message]
          HEADERS.each do |value, header|
            response.headers[header] = options[value].to_s if options[value]
          end
        else
          response.headers['X-SRBUJ-REMOVE'] = 'true'
        end
      end
    end
  end
end
ActionController::Base.send(:include, SrBuj::ActionController::Helpers)
