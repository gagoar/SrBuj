(function ($, undefined) {
  /**
   * Better Unobtrusive  javascript request for Jquery
   * https://github.com/gagoar/SrBuj
   *
   * Requires jQuery 1.7.0 or later.
   *
   * Released under the MIT license
  **/

  'use strict';

  $.fn.present = function () {
    return this.length === 1 && this;
  };
  var SrBuj, self;
  $.SrBuj = SrBuj = self = {
    version: '0.9.0alpha4'
    , selector: '[data-remote][data-target]'
    , events: ['error', 'success', 'complete']
    , wrongHeader: /javascript/
    , notifyHeaders: {
      , message: 'X-SRBUJ-MSG'
      , type: 'X-SRBUJ-TYPE'
      , side: 'X-SRBUJ-SIDE'
      , position: 'X-SRBUJ-POS'
      , time: 'X-SRBUJ-TIME'
    }
    , defaults: {
      '$el': undefined
      , target: undefined
      , url: undefined
      , push: false
      , modal: false
      , method: 'GET'
      , change: true
      , custom: false
      , remove: false
      , replace: false
      , onError: undefined
      , wrapper: undefined
      , callback: false
      , jqueryselector: false
    }
    , boolean_defaults: ['jqueryselector', 'modal', 'custom', 'replace', 'push', 'remove']
    , changeDom: function (method, $target, data) {
        var
            action  = self.getActionByVerb(method)
          , withArg = !(/remove/).test(action)
          , args    = withArg ? data  : null

        $target[action].apply(self, [args])
        return true
    }
    , getActionByVerb: function (method) {
        switch (method.toUpperCase()) {
          case 'POST':            return 'append';
          case 'DELETE':          return 'remove';
          case 'PUT' || 'PATCH':  return 'replaceWith';
          default:                return 'html';
        }
    }
    , kindOfCallback: function (callback) {
        return (typeof callback === 'function')
                ? callback
                : window[callback] === 'function'
                  ? window[callback]
                  : new Function(callback)
    }
    , getUrl: function ($el) {
        var url = $el.attr('href') || $el.attr('action')

        if ((/^[\/#](\w)/).test(url)) return url;
    }
    , needToChangeUrl: function (url) {
        return !((window.document.location.origin + url) == window.document.location.href);
    }
    , browserSupportsPushState: function () {
        return window.history && window.history.pushState && window.history.replaceState;
    }
    , getVerb: function ($el, data_options) {
      var
          respond_as = data_options['respond-as']
        , dataMethod = data_options.method
        , replace = data_options.hasOwnProperty('replace')
        , method = $el.attr('method')
        , verb = respond_as || dataMethod || (method && replace) ? 'PUT' : method
      return verb.toUpperCase();
    }
    , canWePush: function (options){
      return self.browserSupportsPushState() &&
             options.url &&
             options.push &&
             self.needToChangeUrl(options.url)
    }
    , getOptions: function (el, user_options) {
        var
            user_options = user_options || {}
          , options = {}
          , $el = $(user_options.el || el).present()
          , data_options = $el.data()
          , el_op = {
              '$el': $el
            , url: $.SrBuj.getUrl($el)
            , target: data_options.target
            , method: $.SrBuj.getVerb($el data_options)
            , change: !data_options.hasOwnProperty('nochange')
            , onError: data_options.error
            , wrapper: data_options.error
            , callback: data_options.callback
          }

        for (var i = 0, attr; attr = self.boolean_defaults[i++];)
          el_op[attr] = data_options.hasOwnProperty(attr)

        for (var attr in self.defaults) {
          if (self.defaults.hasOwnProperty(attr)) {
            options[attr] = user_options[attr] || el_op[attr] || self.defaults[attr]
          }
        }

        return options
    }
    , success: function (e, data, status, xhr, user_options) {
      if (xhr && self.wrongHeader.test(xhr.getResponseHeader('Content-Type'))) return

        var
            options = self.getOptions(e.target, user_options)
          , $target = options.jqueryselector ? $(options.target).present() : $(document.getElementById(options.target))
          , $wrapper = $(options.jqueryselector ? options.wrapper : document.getElementById(options.wrapper))

        if ($target.present()) {
          e.stopPropagation()

          if (self.canWePush(options)) window.history.pushState({ SrBuj: true }, '', options.url)


          if (options.modal) {
            var $elModal = options.wrapper? $wrapper : $target;

            $elModal.modal('toggle');
          }

          if (options.remove) this.remove()

          if (!options.custom && options.change)
            self.changeDom(options.method, $target, data) && return

          if (options.callback) {
            var callback = self.kindOfCallback(options.callback);

            callback && callback.apply(self, [e, data, status]);
          }
        }
    }
    , error: function (e, xhr, status, error_code, user_options) {
        if (xhr && self.wrongHeader.test(xhr.getResponseHeader('Content-Type'))) return

        var
            $el = $(e.target).present()
          , data_options = $el.data()
          , error = data_options.error
          , jqueryselector = data_options.hasOwnProperty('jqueryselector')
          , $error = $(jqueryselector ? error : document.getElementById(error))

        if (error) {
          e.stopPropagation()
          self.changeDom('ERROR', $error, xhr.responseText);
        } else
            throw 'cant find data-error on element ' + e.target + ' maybe content_type missing on response?';
    }
    , complete: function (e, xhr, status) {
        if (xhr) {
          e.stopPropagation();
          var notify = {}

          for (var attr in self.notifyHeaders){
            if (self.notifyHeaders.hasOwnProperty(attr))
              notify[attr] = xhr.getResponseHeader(self.notifyHeaders[attr]);
         }

        if (notify.message) self.Util.notify(notify)
      }
    }
    , bind: function (selector) {
        var selector = selector || self.selector;

        for(var i = 0, event; event = self.events[i++];){
          $(document).on('ajax:' + event, selector, event)
        }
    }
    , Util: {
        defaults: {
            gMsg_id: '_growlingMsg'
          , link_id: '_srbujLink'
          , link_options: { remote: true, srbuj: true }
          , notify: { own_class: 'srbuj-notify', side: 'right', position: 'bottom', time: 2000 }
          , matchingClasses: /^(info|warning|error)$/
        }
      , notify: function (user_options) {
          /* This function will show a growling element, with the message and attached class that was given.
           * will endure only a few seconds and its going to be removed from DOM afterwards.
           * use: $.SrBuj.Util.notify({message: 'This is Madness', type: 'info'}) this will produce
           * <s id=_growlingMsg class=info>This is Madness</s>
           */
          var user_options = user_options || {}
            , options = $.extend({}, self.Util.defaults.notify, user_options )

          if (self.Util.gMsg_interval) {
            window.clearInterval(self.Util.gMsg_interval)
          }
          var gMsg = document.getElementById(self.defaults.gMsg_id) || document.createElement('s');
          gMsg.id = self.defaults.gMsg_id;
          gMsg.textContent = options.message;
          gsMsg.className = self.defaults.matchingClasses.test(options.type) ? ['alert', '-', options.type].join('') : (options.type || 'alert-info')

          if (!$('#'+ gMsg.id).present()) $('body').append(gMsg);

          gMsg.className += [' alert', options.side, options.position , options.own_class ].join(' ').toLowerCase();

          self.Util.gMsg_interval = window.setInterval(self.Util.removeNotify, options.time);
      }
      , removeNotify: function () {
          $(['#', self.Util.defaults.gMsg_id].join('')).removeClass(self.Util.defaults.notify.own_name);
      }
      , link: function (user_options) {
          /* This function will create a link with options, trigger it and remove the link afterwards
          * user_options must be a hash (Obj) with key: value without the data word
          * if the hash contain more keys, these will be integrated too as data-key form. Example:
          * { target: 'modal', error: 'modal', modal: true, href: '/admin/request'}
          * this will become:
          * <a href: '/admin/request' data-remote data-srbuj data-target= 'modal' data-modal data-error= 'modal' ></a>
          * note: we add an extra attribute, in order to debug ([data-srbuj]) and recover the link that has been made
          * from the dom that
          * if the attribute [data-srbuj] its present in any element that is handled by SrBuj response it will be removed
          * from Dom after complete the process
          * the white spaces will be removed from keys.
          */
          var user_options = user_options || {};

          if (user_options.target && user_options.href) {

            $.extend(user_options, self.link_options)

            var link = document.createElement('a')

            link.id = self.link_id;
            link.href = user_options.href
            delete user_options.href

            for (var attr in user_options) {
              if (user_options.hasOwnProperty(attr)) {
                var
                    key = 'data-' + attr.replace(/\s/g, '')
                  , value = (user_options[attr] === true) ? '' : user_options[attr]

                link.setAttribute(key, value);
              }
            }
            $('body').append(link);
            $(link).trigger('click');
          } else
            throw 'not enough options given. Maybe target or href not present?'
      }
    }
  };
  $(function () { self.bind() });

})(jQuery);
