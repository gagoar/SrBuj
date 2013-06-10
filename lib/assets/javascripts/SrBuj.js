(function ($, undefined) {
    /**
     * Better Unobtrusive  javascript request for Jquery
     * https://github.com/gagoar/SrBuj
     *
     * Requires jQuery 1.7.0 or later.
     *
     * Released under the MIT license
     *
     * JSHINT
     * jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, jquery:true, indent:4, maxerr:50
     * global jQuery
     */

    'use strict';

    $.fn.present = function () {
        return this.length === 1 && this;
    };
    var SrBuj;
    $.SrBuj = SrBuj = {
        version: '0.9.0alpha3',
        selector: '[data-remote][data-target]',
        notifyHeaders: { message: 'X-SRBUJ-MSG', type: 'X-SRBUJ-TYPE', side: 'X-SRBUJ-SIDE', position: 'X-SRBUJ-POS', time: 'X-SRBUJ-TIME' },
        defaults: {
            '$el': undefined,
            target: undefined,
            onError: undefined,
            wrapper: undefined,
            method: 'GET',
            modal: false,
            change: true,
            custom: false,
            replace: false,
            callback: false,
            remove: false,
            url: undefined,
            push: false,
            jqueryselector: false
        },
        changeDom: function (method, $target, data) {
            switch (method) {
            case 'POST':
                $target.append(data);
                break;
            case 'PUT':
            case 'PATCH':
                $target.replaceWith(data);
                break;
            case 'DELETE':
                $target.remove();
                break;
            default:
                $target.html(data);
            }
        },
        kindOfCallback: function (callback) {
            if (typeof callback === 'function') {
                return callback;
            } else {
                if (window[callback]) {
                    return window[callback];
                } else {
                    return new Function(callback);
                }
            }
        },
        getUrl: function($el){
          var url = $el.attr('href') || $el.attr('action');
          if((/^[\/#](\w)/).test(url)){
            return url
          }
        },
        needToChangeUrl: function(url){
          return !((window.document.location.origin + url) == window.document.location.href)
        },
        browserSupportsPushState: function(){
          return window.history && window.history.pushState && window.history.replaceState
        },
        getVerb: function ($el) {
            var respond_as = $el.data('respond-as'),
                dataVerb = $el.data('method'),
                replace = $el.data('replace'),
                proto = $el.attr('method');
            if (respond_as) {
                return respond_as.toUpperCase();
            } else
            if (dataVerb) {
                return dataVerb.toUpperCase();
            } else {
                if (proto) {
                    return replace ? 'PUT' : proto.toUpperCase();
                }
            }
        },
        getOptions: function (el, user_options) {
            user_options = user_options || {};
            var options = {},
                $el = $(user_options.el || el).present(),
                el_options = {
                    '$el': $el,
                    'target': $el.data('target'),
                    'method': $.SrBuj.getVerb($el),
                    'onError': $el.data('error'),
                    'callback': $el.data('callback'),
                    'change': !($el.data('nochange') || false),
                    'jqueryselector': $el.is('[data-jqueryselector]'),
                    'modal': $el.is('[data-modal]'),
                    'wrapper': $el.data('error'),
                    'custom': $el.is('[data-custom]'),
                    'replace': $el.data('replace'),
                    'url': $.SrBuj.getUrl($el),
                    'push': $el.is('[data-push]'),
                    'remove': $el.is('[data-srbuj]')
                };
            user_options = user_options || {};
            for ( var attr in this.defaults ) {
                if ( this.defaults.hasOwnProperty( attr ) ) {
                    options[attr] = user_options[attr] || el_options[attr] || this.defaults[attr];
                }
            }
            return options;
        },
        success: function (e, data, status, xhr, user_options) {
          if ( xhr ){
            var notify = {};
            for ( var attr in $.SrBuj.notifyHeaders )
              if ( $.SrBuj.notifyHeaders.hasOwnProperty( attr ) ) {
                notify[attr] =  xhr.getResponseHeader( $.SrBuj.notifyHeaders[attr] );
              }
              if ( notify.message ){ $.SrBuj.Util.notify(notify) }
              if ( (/javascript/).test( xhr.getResponseHeader('Content-Type') )){
                return true;
              }
          }
          var options = $.SrBuj.getOptions(e.target, user_options),
          $target = options.jqueryselector ? $(options.target).present() : $(document.getElementById(options.target)),
          $wrapper = options.jqueryselector ? $(options.wrapper) : $(document.getElementById(options.wrapper));
          if ($target.present()) {
            e.stopPropagation();
            if (!options.custom) {
              if (options.change) {
                $.SrBuj.changeDom(options.method, $target, data);
              }
              if (options.modal) {
                if (options.wrapper) {
                  $wrapper.modal('toggle');
                } else {
                  $target.modal('toggle');
                }
              }
            }
            if(options.url && options.push && $.SrBuj.needToChangeUrl(options.url) && $.SrBuj.browserSupportsPushState() ){
              window.history.pushState({ SrBuj: true }, '', options.url)
            }
            if (options.callback) {
              var callback = $.SrBuj.kindOfCallback(options.callback);
              if (callback) {
                callback.apply(this, [e, data, status]);
              }
            }
            if (options.remove){
              this.remove();
            }
          }},
        fail: function (e, data, status, error_code, user_options) {
          e.stopPropagation();
          var $el = $(e.target).present(),
              error = $el.data('error'),
              jqueryselector = $el.data('jqueryselector'),
              $error = jqueryselector ? $(error) : $(document.getElementById(error));
          if (error) {
            $.SrBuj.changeDom('ERROR', $error, data.responseText);
            var notify = {};
            for ( var attr in $.SrBuj.notifyHeaders )
              if ( $.SrBuj.notifyHeaders.hasOwnProperty( attr ) ) {
                notify[attr] =  data.getResponseHeader( $.SrBuj.notifyHeaders[attr] );
              }
              if ( notify.message ){ $.SrBuj.Util.notify(notify) }
          }else {
            throw 'cant find data-error on element ' + e.target + ' maybe content_type missing on response?';
          }
        },
        bind: function (selector) {
            selector = selector || this.selector;
            $(document).on('ajax:success', selector, this.success);
            $(document).on('ajax:error', selector, this.fail);
        },
        Util: {
          notify: function (options){
          /* This function will show a growling element, with the message and attached class that was given.
           * will endure only a few seconds and its going to be removed from DOM afterwards.
           * use: $.SrBuj.Util.notify({message: 'This is Madness', type: 'info'}) this will produce
           * <s id=_growlingMsg class=info>This is Madness</s>
           */
           var options = options || {};
           if( options.message ){
             var _growlingMsg = document.createElement('s');
             _growlingMsg.id = '_growlingMsg';
             if ( options.type ){
               _growlingMsg.className = (/^(info|warning|error)$/).test( options.type ) ?
                ['alert', '-' , options.type ].join('') : options.type;
             }else{
               _growlingMsg.className = 'alert-info';
             }
             _growlingMsg.textContent = options.message;
             $('body').append(_growlingMsg);
             _growlingMsg.className += [' alert', options.side || 'right', options.position ||  'bottom', 'srbuj-notify' ].join(' ').toLowerCase();
             options.time = Number( options.time ) > 0 ? options.time : 2000;
             setInterval($.SrBuj.Util.removeNotify, options.time);
          }
          },
          removeNotify: function(){
            $('#_growlingMsg').remove();
          },
          link: function (user_options){
            /* This function will create a link with options, trigger it and remove the link afterwards
             * user_options must be a hash (Obj) with key: value without the data word
             * if the hash contain more keys, these will be integrated too as data-key form. Example:
             * { target: 'modal', error: 'modal', modal: true, href: '/admin/request'}
             * this will become:
             * <a href: '/admin/request' data-remote data-srbuj data-target= 'modal' data-modal data-error= 'modal' ></a>
             * note: we add an extra attribute, in order to debug ([data-srbuj]) and recover the link that has been made from the dom that
             * if the attribute [data-srbuj] its present in any element that is handled by SrBuj response it will be removed form dom after complete the process
             * the white spaces will be removed from keys.
            */
            var user_options = user_options || {};
            $.extend(user_options, {remote: true, srbuj: true});
            if(user_options.target && user_options.href){
              var _srbujLink = document.createElement('a');
              _srbujLink.id = '_srbujLink';
              _srbujLink.href = user_options.href;
                  delete user_options.href;
              for (var attr in user_options) {
                if (user_options.hasOwnProperty(attr)) {
                  var key = ['data', attr.replace(/\s/g, '')].join('-'),
                      value = user_options[attr];
                  if( value === true ){ value = '' }
                  _srbujLink.setAttribute(key, value);
                }
              }
              $('body').append(_srbujLink);
              $(_srbujLink).trigger('click');
            }else{
              throw 'not enough options given. Maybe target or href not present?'
            }
          }
        }
    };

    $(function () {
        $.SrBuj.bind();
    });

})(jQuery);
