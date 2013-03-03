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

    success: function(e, data){
      var $el = $(e.target),
      ismodal = $el.data('modal') || false,
      replace = $el.data('replace') || false,
      remove = $el.attr('method') == 'delete' || false,
      fn = $el.data('callback'),
      callback = (typeof  fn == 'function') ? fn : window[fn],
      target = document.getElementById($el.data('target')),
      wrapper = document.getElementById($el.data('error')),
      $target = $(target);
      if(remove) $target.remove();
      else replace ? $target.replaceWith(data) : $target.html(data);
      if(ismodal) wrapper ? $(wrapper).modal('toggle') : $target.modal('toggle');
      if(callback) callback.apply(this,[e, data]);

    },
    fail: function(e, data){
      var $el = $(e.target),
      error = document.getElementById($el.data('error'));
      $(error).html(data.responseText);
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
