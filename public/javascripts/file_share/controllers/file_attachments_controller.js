FileShare.Controllers.FileAttachments = Backbone.Controller.extend({
  routes: {
    "file_share/:id": "edit",
    "file_share/delete/:id": "delete"
  },
  initialize: function(options) {
    window.location.hash = '#';
  },
  userMessageView: function(msg) {
    this.userMessage = new FileShare.Views.UserMessage({
      message: msg
    });
    return this.userMessage;
  },
  editFormView: function(file) {
    if( !this.editForm ) {
      this.editForm = new FileShare.Views.FileAttachmentEditForm({
        model: file,
        id: 'editing_file_attachment_' + file.get('id')
      });
    }  
    return this.editForm;
  },
  formMessageView: function(options) {
    if( !this.formMessage ) {
      this.formMessage = new FileShare.Views.FormMessage(options);
    }
    return this.formMessage.render();
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
      // mv render & dom manip to view init
      // then just call this.editFormView(file)
      // and update #editFormView to simply instantiate the view
      // prob don't even need to store the instance anywhere...
      $('#file_attachment_'+id).after(this.editFormView(file).render().el);
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