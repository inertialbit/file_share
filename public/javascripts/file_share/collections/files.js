FileShare.Collections.Files = Backbone.Collection.extend({
  model: FileShare.Models.File,
  url: '/file_attachments',
  comparator: function(file) {
    return file.get('name') + ' ' + file.get('updated_at');
  }
});