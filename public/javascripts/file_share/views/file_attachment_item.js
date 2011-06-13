FileShare.Views.FileAttachment = Backbone.View.extend({
  tagName: 'div',
  className: 'file_attachment',
  events: {
    'mouseover': 'showButtons',
    'mouseout': 'hideButtons',
    'click .fake_button': 'preventDefault'
  },
  initialize: function() {
    this.containerTemplate = _.template($('#file-attachment-container-template').html());
    this.nameTemplate = _.template($('#file-attachment-name-template').html());
    this.descriptionTemplate = _.template($('#file-attachment-description-template').html());
    _.bindAll(this, 'render');
    this.model.bind('change', this.render);
    //this.bind('render', this.hideButtons);
    this.model.view = this;
  },
  preventDefault: function(activeEvent) {
    //activeEvent.preventDefault();
  },
  hideButtons: function() {
    this.$('.fake_button').hide();
  },
  showButtons: function() {
    this.$('.fake_button').show();
  },
  render: function() {
    var compiled = [];
    if( this.model.get('name') ) {
      compiled.push(this.nameTemplate({
        name: this.model.get('name'),
        id: this.model.get('id')
      }));
    }
    if( this.model.get('attachable_id') && this.model.get('attachable_type') ) {
      compiled.push(this.containerTemplate({
        container: this.model.get('attachable_type')
      }));
    }
    if( this.model.get('description') ) {
      compiled.push(this.descriptionTemplate({
        description: this.model.get('description')
      }));
    }
    $(this.el).html(compiled.join(''));
    this.hideButtons();
    return this;
  }
});

FileShare.Views.FileAttachmentList = Backbone.View.extend({
  el: $('#file_attachments'),
  initialize: function() {
    _.bindAll(this, 'addOne', 'addAll');
    FileShare.Files.bind('remove', this.removeOne);
    FileShare.Files.bind('refresh', this.addAll);
    FileShare.Files.bind('add', this.addOne)
  },
  addOne: function(file) {    
    var view = new FileShare.Views.FileAttachment({
      model: file,
      id: 'file_attachment_'+file.get('id')
    });
    $('#file_attachments').append($(view.render().el).effect('highlight'));
  },
  addAll: function() {
    FileShare.Files.each(this.addOne);
  },
  removeOne: function(file) {
    $(file.view.el).remove();
  }
});