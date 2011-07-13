FileShare.Views.FileList = Backbone.View.extend({
  className: 'file_attachments',
  id: 'fs_file_list',
//  itemView: FileShare.Views.File,
  
  initialize: function() {
    if( this.domHasEl() ) {
      this.el = $('#'+this.id);
    }
    
    _.bindAll(this, 'addOne', 'addAll', 'update', 'removeOne');

    this.collection.bind('remove', this.removeOne);
    this.collection.bind('refresh', this.addAll);
    this.collection.bind('change', this.update);
    this.collection.bind('add', this.addOne);
  },
  domHasEl: function() {
    return $('#'+this.id)[0] != undefined;
  },
  render: function() {
    if( !this.domHasEl() ) {
      var ip = this.insertPoint();
      $(ip).prepend($(this.el));
    }
    return this;
  },
  insertPoint: function() {
    if( this.domHasEl() ) {
      if( $('.inner_content')[0] ) {
        return $('.inner_content')[0];
      } else {
        return $('body')[0];
      }
    }
  },
  fileView: function(file) {
    new FileShare.Views.File({
      model: file,
      id: 'file_attachment_'+file.get('id')
    });
  },
  insert: function(file) {
    var i = this.collection.indexOf(file);
    if( i == 0 ) {
      $(this.el).prepend($(file.view.el));
    } else {
      $(this.$('.file_attachment')[i-1]).after($(file.view.el));
    }
    $('#'+file.view.id).effect('highlight');
  },
  update: function(file) {
    this.removeOne(file);
    this.addOne(file);
  },
  addOne: function(file) {
    this.fileView(file);
    this.insert(file);
  },
  addAll: function() {
    this.collection.each(this.addOne);
  },
  removeOne: function(file) {
    if( file.view ) {
      $(file.view.el).remove();
    }
  }
});