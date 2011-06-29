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
  },
  render: function() {
    _.each(this.errors, function(errMsg, fieldName) {
      $(this.el).html(errMsg+'');
      $('#file_attachment_'+fieldName+'_'+this.model.get('id')).after($(this.el));
    }, this);
    return this;
  }
});

FileShare.Views.FileAttachmentUploadForm = Backbone.View.extend({
  className: "file-attachment-fields",
  initialize: function() {
    this.template = _.template($('#file-attachment-upload-form-template').html());
  },
  render: function() {
    $(this.el).html(this.template({
      size: to_mebibytes(this.model.size),
      container_select: '',
      cid: this.model.id,
      name: this.model.name,
      description: ''
    }));
    return this;
  }
});

FileShare.Views.FileAttachmentEditForm = Backbone.View.extend({
  className: "file-attachment-fields",
  /* for when we don't need to support lowpro
  events: {
    'submit form': 'update',
    'click button[type=reset]': 'close'
  },
  */
  initialize: function() {
    this.template = _.template($('#file-attachment-edit-form-template').html());
  },
  update: function(submitEvent) {
    submitEvent.preventDefault();
    if( this.model ) {
      FileShare.FileAttachmentsController.update(this.model);
    }
  },
  close: function(cancelEvent) {
    window.location.hash = '#';
    
    $(this.el).remove();
    $('#file_attachment_'+this.model.get('id')).show();
  },
  render: function() {
    if( this.model ) {
      $(this.el).html(this.template(this.model.toJSON()));
      
      /*
        ugly but maintains compat for use in apps with lowpro
      */
      var me = this;
      this.$('button[type=reset]').click(function(cancelEvent) {
        me.close(cancelEvent);
      });
      this.$('button[type=submit]').click(function(submitEvent) {
        me.update(submitEvent);
      });
      return this;
    }
  }
});
