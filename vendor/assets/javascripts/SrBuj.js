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
  var SrBuj;
  $.SrBuj = SrBuj = {
    selector: '[data-remote][data-target]',
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
    success: function(e, data){
      var $el = $(e.target),
          isModal = $el.data('modal') || false,
          verb = $el.attr('method') || 'GET',
          method = ( verb.toUpperCase() == 'POST' && $el.data('replace')) ? 'PUT' : verb.toUpperCase();
          change = $el.attr('nochange') || true,
          fn = $el.data('callback'),
          callback = (typeof  fn == 'function') ? fn : window[fn],
          target = document.getElementById($el.data('target')),
          wrapper = document.getElementById($el.data('error')),
          $target = $(target);

      if(change) $.SrBuj.changeDom(method.toUpperCase(),$target,data);
      if(isModal) wrapper ? $(wrapper).modal('toggle') : $target.modal('toggle');
      if(callback) callback.apply(this,[e, data]);

    },
    fail: function(e, data){
      var $el = $(e.target),
      error = document.getElementById($el.data('error'));
      if( error )
        $.SrBuj.changeDom('ERROR', $(error), data.responseText);
      else
        throw 'cant find data-error target on element';
    },
    bind: function(){
      $(document).on('ajax:success', this.selector, this.success);
      $(document).on('ajax:error', this.selector, this.fail);
    }
  }

  $(function() {
    $.SrBuj.bind();
  });

})( jQuery );
