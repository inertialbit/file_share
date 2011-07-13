FileShare.Views.FormMessage = Backbone.View.extend({
  className: 'notice',
  tagName: 'p',
  errors: {},
  initialize: function() {
    if( this.options.errors ) {
      this.errors = $.parseJSON(this.options.errors);
    } else {
      this.errors = {};
    }
    this.render();
  },
  render: function() {
    _.each(this.errors, function(errMsg, fieldName) {
      $(this.el).html(errMsg+'');
      $('#file_attachment_'+fieldName+'_'+this.model.get('id')).after($(this.el));
    }, this);
    return this;
  }
});