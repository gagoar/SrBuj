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
        version: '0.7.0',
        selector: '[data-remote][data-target]',
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
                    'jqueryselector': $el.data('jqueryselector'),
                    'modal': $el.data('modal'),
                    'wrapper': $el.data('error'),
                    'custom': $el.data('custom'),
                    'replace': $el.data('replace'),
                    'url': $.SrBuj.getUrl($el),
                    'push': $el.data('push')
                };
            user_options = user_options || {};
            for (var attr in this.defaults) {
                if (this.defaults.hasOwnProperty(attr)) {
                    options[attr] = user_options[attr] || el_options[attr] || this.defaults[attr];
                }
            }
            return options;
        },
        success: function (e, data, status, user_options) {
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

            }
        },

        fail: function (e, data, status, user_options) {
            e.stopPropagation();
            var $el = $(e.target).present(),
                error = $el.data('error'),
                jqueryselector = $el.data('jqueryselector'),
                $error = jqueryselector ? $(error) : $(document.getElementById(error));
            if (error) {
                $.SrBuj.changeDom('ERROR', $error, data.responseText);
            } else {
                throw 'cant find data-error on element ' + e.target + ' maybe content_type missing on response?';
            }

        },
        bind: function (selector) {
            selector = selector || this.selector;
            $(document).on('ajax:success', selector, this.success);
            $(document).on('ajax:error', selector, this.fail);
        }
    };

    $(function () {
        $.SrBuj.bind();
    });

})(jQuery);
