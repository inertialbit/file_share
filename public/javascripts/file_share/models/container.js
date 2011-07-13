FileShare.Models.Container = Backbone.Model.extend({});
/*
$(function(){
  
  var FileContainerItem = Backbone.View.extend({
    tagName: "p",
    className: "file-container-item",
    template: _.template("- <%= name %>"),
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    }
  });
  
  var FileContainerModule = Backbone.View.extend({
    el: $('#app'),
    events: {
      "click #load-containers" : "loadContainers"
    },
    initialize: function() {
      FileContainers.fetch();
    },
    loadContainers: function() {
      var file_containers = FileContainers.fetch();
      file_containers.each(function(fc) {
        var v = new FileContainerItem({model: fc});
        $("#file_containers").append(v.render().el);
      });
    }
  });
  
  window.FileComponent = new FileContainerModule;
});

*/