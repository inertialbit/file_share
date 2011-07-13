FileShare.Views.File = Backbone.View.extend({
  tagName: 'div',
  className: 'file_attachment',
  template_ids: {
    container: 'file-attachment-container-template',
    name: 'file-attachment-name-template',
    description: 'file-attachment-description-template'
  },
  events: {
    'mouseover': 'showButtons',
    'mouseout': 'hideButtons'
  },
  initialize: function() {
    if( this.options.template_ids ) {
      $.extend(this.template_ids, this.options.template_ids);
    }
    this.templates = {
      name: _.template($('#'+this.template_ids.name).html()),
      container: _.template($('#'+this.template_ids.container).html()),
      description: _.template($('#'+this.template_ids.description).html())
    };

    _.bindAll(this, 'render');
    
    this.model.bind('change', this.render);
    this.model.view = this;
    
    this.render();
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
      compiled.push(this.templates['name']({
        name: this.model.get('name'),
        id: this.model.get('id')
      }));
    }
    if( this.model.get('attachable_name') && this.model.get('attachable_type') ) {
      compiled.push(this.templates['container']({
        attachable_name: this.model.get('attachable_name'),
        attachable_type: this.model.get('attachable_type')
      }));
    }
    if( this.model.get('description') ) {
      compiled.push(this.templates['description']({
        description: this.model.get('description')
      }));
    }
    $(this.el).html(compiled.join(''));
    this.hideButtons();
    return this;
  }
});
