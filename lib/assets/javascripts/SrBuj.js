(function($, undefined) {
  /**
 * Better Unobtrusive  javascript request for Jquery
 * https://github.com/gagoar/SrBuj
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */
  $.fn.present = function(){
    return this.length === 1 && this
  };
  var SrBuj;
  $.SrBuj = SrBuj = {
    version: '0.5.3',
    selector: '[data-remote][data-target]',
    defaults: {
        '$el': undefined,
        target: undefined,
        onError: undefined,
        wrapper: undefined,
        method: 'GET',
        modal: false,
        custom: false,
        change: true,
        custom: false,
        replace: false,
        callback: false,
        jqueryselector: false
    },
    changeDom: function(method,$target,data){
      switch(method){
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
    getVerb: function($el){
        var dataVerb = $el.data('method'),
            replace = $el.data('replace'),
            proto = $el.attr('method');
      if( dataVerb )
          return dataVerb.toUpperCase();
      else
        if (proto) return replace ? 'PUT' : proto.toUpperCase();
    },
    getOptions: function(el, user_options){
      var options = {},
          user_options = user_options || {};
          $el =  $( user_options['el'] || el  ).present(),
          el_options = {
            '$el': $el,
            'target': $el.data('target'),
            'method': $.SrBuj.getVerb($el),
            'onError': $el.data('error'),
            'callback': $el.data('callback'),
            'change': ! ( $el.data('nochange') || false ),
            'jqueryselector': $el.data('jqueryselector'),
            'modal': $el.data('modal'),
            'wrapper': $el.data('error'),
            'custom': $el.data('custom'),
            'replace': $el.data('replace')
          };
          for(var attr in this.defaults){
            options[attr] = user_options[attr] || el_options[attr] || this.defaults[attr];
          }
      return options;
    },
    success: function(e, data,status,user_options){
      var options = $.SrBuj.getOptions(e.target, user_options),
              $el = options['$el'],
              $target =  options['jqueryselector'] ? $(options['target']).present() : $(document.getElementById(options['target'])) ,
              $wrapper = options['jqueryselector'] ? $(options['wrapper']) : $(document.getElementById(options['wrapper']));
      if($target.present()){
         e.stopPropagation();
        if(!options['custom']){
          if(options['change'])
            $.SrBuj.changeDom(options['method'],$target,data);
          if(options['modal'])
            options['wrapper'] ? $wrapper.modal('toggle') : $target.modal('toggle');
        }
        if(options['callback'])
          callback = (typeof options['callback'] == 'function') ? options['callback'] : window[options['callback']],
        callback.apply(this,[e, data, status]);
      }
    },
    fail: function(e, data, status, user_options){
      e.stopPropagation();
      var $el = $(e.target).present(),
          error = $el.data('error'),
          jqueryselector = $el.data('jqueryselector'),
          $error = jqueryselector ? $(error) :$(document.getElementById(error));
      if( error ){
        $.SrBuj.changeDom('ERROR', $error, data.responseText);
      }
      else
        throw 'cant find data-error on element' + e.target;
    },
    bind: function(selector){
      var selector = selector || this.selector;
      $(document).on('ajax:success', selector, this.success);
      $(document).on('ajax:error', selector, this.fail);
    }
  }

  $(function() {
    $.SrBuj.bind();
  });

})( jQuery );
