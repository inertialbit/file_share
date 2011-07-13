FileShare.Routers.File = Backbone.Router.extend({
  routes: {
    "file_share/:id": "edit",
    "file_share/delete/:id": "delete"
  },
  initialize: function(options) {
    window.location.hash = '#';
  },
  userMessageView: function(msg) {
    return new FileShare.Views.UserMessage({
      message: msg
    });
  },
  editFormView: function(file) {
    return new FileShare.Views.FileEditForm({
      model: file,
      id: 'editing_file_attachment_' + file.get('id')
    });
  },
  formMessageView: function(options) {
    return new FileShare.Views.FormMessage(options);
  },
  removeEditFormView: function(file) {
    return $('#editing_file_attachment_'+file.id).remove();
  },
  getFileName: function(model) {
    return $('#file_attachment_name_'+model.get('id')).val();
  },
  getFileDescription: function(model) {
    return $('#file_attachment_description_'+model.get('id')).val();
  },
  getFileContainer: function(model) {
    return $('#file_attachment_container_'+model.get('id')).val();
  },
  edit: function(id) {
    var file = FileShare.Files.get(id);
    if( file ) {
      $('#file_attachment_'+id).after(this.editFormView(file).el);
      $('#file_attachment_'+id).hide();
    } else {
      this.userMessageView("File not found.");
      window.location.hash = '#';
    }
  },
  update: function(model) {
    var me = this;
    model.save({
      name: this.getFileName(model),
      description: this.getFileDescription(model),
      file_container: this.getFileContainer(model)
    }, {
      success: function(model, response) {
        me.removeEditFormView(model);
      },
      error: function(model, response) {
        me.formMessageView({
          className: 'error small_text',
          model: model,
          errors: response.errors
        });
      }
    });
    window.location.hash = '#';
  },
  delete: function(id) {
    var file = FileShare.Files.get(id);
    var me = this;
    if( file ) {
      var confirmation = confirm("Delete "+file.get('name')+"?");
      if( confirmation ) {
        file.destroy({
          success: function(model, response) {
            var msg = 'Deleted '+model.get('name')+'.';
            FileShare.Files.remove(model);
            me.userMessageView(msg);
          },
          error: function(model, response) {
            me.userMessageView(response.responseText);
          }
        });
      }
    } else {
      me.userMessageView('File not found.');
    }
    window.location.hash = '#';
  }
});