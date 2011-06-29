FileShare.Collections.FileAttachments = Backbone.Collection.extend({
  model: FileShare.Models.FileAttachment,
  url: '/file_attachments',
  comparator: function(file) {
    return file.get('name') + ' ' + file.get('updated_at');
  }
});