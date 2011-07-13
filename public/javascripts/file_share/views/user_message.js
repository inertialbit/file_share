FileShare.Views.UserMessage = Backbone.View.extend({
  tagName: 'div',
  className: 'notice',
  id: 'user-message',
  initialize: function() {
    this.template = _.template($('#file-share-user-message-template').html());
    this.render();
  },
  render: function() {
    $(this.el).append(this.template({
      user_message: this.options.message
    }));
    if( $('#user-message')[0] != undefined ) {
      $('#user-message').replaceWith($(this.el));
    } else {
      $('#file_attachments').parent().prepend($(this.el));
    }  
    FileShare.Effects.messageFade('#user-message');
    return this;
  }
});
