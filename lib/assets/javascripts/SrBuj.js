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
        version: '0.9.0alpha4',
        selector: '[data-remote][data-target]',
        notifyHeaders: { message: 'X-SRBUJ-MSG', type: 'X-SRBUJ-TYPE', side: 'X-SRBUJ-SIDE', position: 'X-SRBUJ-POS', time: 'X-SRBUJ-TIME' },
        defaults: {
            '$el': undefined
            , target: undefined
            , onError: undefined
            , wrapper: undefined
            , url: undefined
            , method: 'GET'
            , modal: false
            , change: true
            , custom: false
            , replace: false
            , callback: false
            , remove: false
            , push: false
            , jqueryselector: false
        },
        boolean_defaults: ['jqueryselector', 'modal', 'custom', 'replace', 'push', 'remove'],
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
        getVerb: function ($el, data_options) {
            var respond_as = data_options.respond-as
              , dataVerb = data_options.method
              , replace = data_options.hasOwnProperty('replace')
              , proto = $el.attr('method');
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
                $el = $( user_options.el || el ).present(),
                data_options = $el.data(),
                el_options = {
                      '$el': $el
                    , 'target': data_options.target
                    , 'change': ! data_options.hasOwnProperty( 'nochange' )
                    , 'onError': data_options.error
                    , 'wrapper': data_options.error
                    , 'callback': data_options.callback
                    , 'url': $.SrBuj.getUrl( $el )
                    , 'method': $.SrBuj.getVerb( $el, data_options )
                };
            for(var i = 0, attr; attr = this.boolean_defaults[i]; i++){
               el_options[attr] = data_options.hasOwnProperty( attr );
            }
            user_options = user_options || {};
            for ( var attr in this.defaults ) {
                if ( this.defaults.hasOwnProperty( attr ) ) {
                    options[attr] = user_options[attr] || el_options[attr] || this.defaults[attr];
                }
            }
            return options;
        },
        success: function (e, data, status, xhr, user_options) {
          if ( xhr && ( /javascript/ ).test( xhr.getResponseHeader( 'Content-Type' ) ) ) return

          var options = $.SrBuj.getOptions(e.target, user_options)
            , $target = options.jqueryselector? $(options.target).present() : $(document.getElementById(options.target))
            , $wrapper = options.jqueryselector? $(options.wrapper) : $(document.getElementById(options.wrapper))

          if ($target.present()) {
            e.stopPropagation();
            if (!options.custom) {
              if ( options.change ) {
                $.SrBuj.changeDom( options.method, $target, data );
              }
              if (options.modal) {
                 options.wrapper?  $wrapper.modal('toggle') : $target.modal('toggle')
                }
              }
            if( options.url && options.push && $.SrBuj.needToChangeUrl( options.url ) && $.SrBuj.browserSupportsPushState() ){
              window.history.pushState( { SrBuj: true }, '', options.url )
            }
            if ( options.callback ) {
              var callback = $.SrBuj.kindOfCallback( options.callback );
              if ( callback ) {
                callback.apply( this, [e, data, status] );
              }
            }
            if (options.remove){
              this.remove();
            }
          }
        },
        fail: function (e, xhr, status, error_code, user_options) {
          if ( xhr && ( /javascript/ ).test( xhr.getResponseHeader( 'Content-Type' )  ) ) return

          var $el = $(e.target).present(),
              data_options = $el.data(),
              error = data_options.error,
              jqueryselector = data_options.hasOwnProperty( 'jqueryselector' ),
              $error = jqueryselector ? $(error) : $(document.getElementById(error));
          if (error) {
            e.stopPropagation();
            $.SrBuj.changeDom('ERROR', $error, xhr.responseText);
          }else {
            throw 'cant find data-error on element ' + e.target + ' maybe content_type missing on response?';
          }
        },
        complete: function (e, xhr, status){
          console.log(arguments);
          if(xhr){
            e.stopPropagation();
            var notify = {};
            for ( var attr in $.SrBuj.notifyHeaders )
              if ( $.SrBuj.notifyHeaders.hasOwnProperty( attr ) ) {
                notify[attr] =  xhr.getResponseHeader( $.SrBuj.notifyHeaders[attr] );
              }
              if ( notify.message ){ $.SrBuj.Util.notify(notify) }
          }
        },
        bind: function (selector) {
            selector = selector || this.selector;
            $(document).on('ajax:success', selector, this.success);
            $(document).on('ajax:error', selector, this.fail);
            $(document).on('ajax:complete', selector, this.complete);
        },
        Util: {
          notify: function (options){
          /* This function will show a growling element, with the message and attached class that was given.
           * will endure only a few seconds and its going to be removed from DOM afterwards.
           * use: $.SrBuj.Util.notify({message: 'This is Madness', type: 'info'}) this will produce
           * <s id=_growlingMsg class=info>This is Madness</s>
           */
           var options = options || {};
             if ($.SrBuj.gMsg_interval){ window.clearInterval($.SrBuj.gMsg_interval) }
             var gMsg = document.getElementById('_growlingMsg')|| document.createElement('s');
             gMsg.id = '_growlingMsg';
             if ( options.type ){
               gMsg.className = (/^(info|warning|error)$/).test( options.type ) ?
                ['alert', '-' , options.type ].join('') : options.type;
             }else{
               gMsg.className = 'alert-info';
             }
             gMsg.textContent = options.message;
             $('body').append(gMsg);
             gMsg.className += [' alert', options.side || 'right', options.position ||  'bottom', 'srbuj-notify' ].join(' ').toLowerCase();
             options.time = Number( options.time ) > 0 ? options.time : 2000;
             $.SrBuj.gMsg_interval =  window.setInterval( $.SrBuj.Util.removeNotify, options.time );
          },
          removeNotify: function(){
            $('#_growlingMsg').removeClass('srbuj-notify');
          },
          link: function ( user_options ){
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
            if(user_options.target && user_options.href){
              $.extend( user_options, { remote: true, srbuj: true } );
              var link = document.createElement('a');
              link.id = '_srbujLink';
              link.href = user_options.href;
                  delete user_options.href;
              for (var attr in user_options) {
                if (user_options.hasOwnProperty(attr)) {
                  var key = ['data', attr.replace( /\s/g, '' )].join('-')
                    , value = ( user_options[attr] === true )? '' : user_options[attr]
                  link.setAttribute( key, value );
                }
              }
              $( 'body' ).append( link );
              $( link ).trigger('click');
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
