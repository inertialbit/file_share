FileShare.Controllers.FileAttachments = Backbone.Controller.extend({
  routes: {
    "file_share/:id": "edit",
    "file_share/delete/:id": "delete"
  },
  initialize: function(options) {
    window.location.hash = '#';
  },
  edit: function(id) {
    var file = FileShare.Files.get(id);
    if( file ) {
      var view = new FileShare.Views.FileAttachmentEditForm({
        model: file,
        id: 'editing_file_attachment_'+id
      });
      $('#file_attachment_'+id).after(view.render().el);
      $('#file_attachment_'+id).hide();
    } else {
      var user_msg = new FileShare.Views.UserMessage({
        message: "File not found."
      });
      user_msg.render();
      window.location.hash = '#';
    }
  },
  update: function(model) {    
    model.save({
      name: $('#file_attachment_name_'+model.get('id')).val(),
      description: $('#file_attachment_description_'+model.get('id')).val(),
      file_container: $('#file_attachment_container_'+model.get('id')).val()
    }, {
      success: function(model, response) {
        $('#file_attachment_'+model.get('id')).show();
        $('#editing_file_attachment_'+model.id).remove();
      },
      error: function(model, response) {
        var error_view = new FileShare.Views.FormMessage({
          className: 'error small_text',
          model: model,
          errors: response.errors
        });
        error_view.render();
      }
    });
    window.location.hash = '#';
  },
  delete: function(id) {
    var file = FileShare.Files.get(id);
    if( file ) {
      var confirmation = confirm("Delete "+file.get('name')+"?");
      if( confirmation ) {
        file.destroy({
          success: function(model, response) {
            var msg = 'Deleted '+file.get('name')+'.';
            var usr_msg = new FileShare.Views.UserMessage({
              message: msg
            });
            FileShare.Files.remove(file);
            usr_msg.render();
          },
          error: function(model, response) {
            var usr_msg = new FileShare.Views.UserMessage({
              message: response.responseText
            });
            usr_msg.render();
          }
        });
      }
    } else {
      var user_msg = new FileShare.Views.UserMessage({
        message: "File not found."
      });
      user_msg.render();
    }
    window.location.hash = '#';
  }
});