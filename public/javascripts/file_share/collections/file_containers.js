FileShare.Collections.FileContainers = Backbone.Collection.extend({
  model: FileShare.Models.FileContainer,
  url: '/file_containers'
});