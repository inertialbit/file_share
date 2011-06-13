/*
 * all lowpro behaviors
 */

ShowHideLink = $.klass({
  initialize: function(options) {
    options = options || {};
    this.showEffect = options.show_effect;
    this.hideEffect = options.hide_effect;
    this.showEffectParams = options.show_effect_params;
    this.hideEffectParams = options.hide_effect_params;
    this.showClassName = $.string(this.element[0].href).toQueryParams()['show'];
    this.hideClassName = $.string(this.element[0].href).toQueryParams()['hide'];
    this.toggleClassName = $.string(this.element[0].href).toQueryParams()['toggle'];
    this.hideMe = options.hide_me;
    this.doNotStop = options.do_not_stop || false;
    this.myToggleClass = options.my_toggle_class;
  },

  onclick: function(e) {
    if(this.hideClassName) {
      //$('.'+this.hideClassName).invoke(this.hideEffect || 'hide', this.hideEffectParams);
      $('.'+this.hideClassName).hide();
    }
    if(this.showClassName) {
      //$('.'+this.showClassName).invoke(this.showEffect || 'show', this.showEffectParams);
      $('.'+this.showClassName).show();
    }
    if(this.toggleClassName) {
      $('.'+this.toggleClassName).toggle();
    }
    if(this.hideMe) {
      this.element.hide();
    }
    this.element.blur();
    
    return this.doNotStop;
  }
});

/*
$('#file_attachments').attach(DynamicForm, {
  formElement: $('#new_description')
});
*/
DynamicForm = $.klass({
  initialize: function(options) {
    this.formElement = options.formElement;
    this.formElement.attach(Remote.Form);
    this.resourceType = this.formElement.attr('id').replace('_dynamic_form', '');
    this.resourceInputs = this.formElement.find(':input[id^="'+this.resourceType+'"]');
    this.resourcePlural = this.element.attr('id');
  },
  onclick: $.delegate({
    '.cancel_dynamic_form': function(clickedElement, event) {
      event.preventDefault();
      this.formElement.hide();
    },
    '.file_attachment_dynamic_form_link': function(clickedElement, event) {      
      event.preventDefault();
      
      var resourceContainer = clickedElement.parents('.' + this.resourceType);
      var resourceId = /\d+/.exec(resourceContainer.attr('id'))[0];
      
      // append resourceId to current form action
      this.formElement.attr("action", "/" + this.resourcePlural + "/" + resourceId);
      
      // clear form input values
      this.formElement.clearForm();
      // move form to resource
      this.formElement.insertBefore(clickedElement);
      
      this.resourceInputs.each(function() {
        // get resource attr names from form input ids
        var resourceAttrContainer = resourceContainer.find('.'+this.id);
        // get resource attr vals from w/in resource container
        this.value = $.trim(resourceAttrContainer.text());
      });
      
      this.formElement.show();
    }
  })
});