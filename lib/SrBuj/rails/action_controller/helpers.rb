module SrBuj
  module ActionController
    module Helpers

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
          response.headers['X-SRBUJ-MSG']  = options[:message].to_s
          response.headers['X-SRBUJ-TYPE'] = options[:type].to_s      if options[:type]
          response.headers['X-SRBUJ-SIDE'] = options[:side].to_s      if options[:side]
          response.headers['X-SRBUJ-POS']  = options[:position].to_s  if options[:position]
          response.headers['X-SRBUJ-TIME'] = options[:time].to_s      if options[:time]
        end
      end
    end
  end
end
ActionController::Base.send(:include, SrBuj::ActionController::Helpers)
