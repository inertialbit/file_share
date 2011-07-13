describe("FileShare.Views.FileList", function() {
  beforeEach(function() {
    this.file1 = new Backbone.Model({
      id: 1,
      name: 'file.txt',
      description: ''
    });
    this.file2 = new Backbone.Model({
      id: 2,
      name: 'file2.txt',
      description: 'filler'
    });
    this.collection = new Backbone.Collection();
    this.collectionBindSpy = sinon.spy(this.collection, 'bind');
  });
  afterEach(function() {
    this.collectionBindSpy.restore();
  });
  describe("auto-el", function() {
    beforeEach(function() {
      this.view = new FileShare.Views.FileList({
        collection: this.collection
      });
    });
    it("id is 'fs_file_list'", function() {
      expect($(this.view.render().el).attr('id')).toEqual('fs_file_list');
    });
    it("class is 'file_attachments'", function() {
      expect($(this.view.render().el)).toHaveClass('file_attachments');
    });
  });
  describe("existing-el", function() {
    beforeEach(function() {    
      $('body').append('<div id="oh-yes" class="my-own"></div>');
      this.view = new FileShare.Views.FileList({
        id: 'oh-yes',
        collection: this.collection
      });
    });
    it("uses an existing element that matches the id property", function() {
      expect($('body')).toContain('div#oh-yes');
      expect($('#oh-yes')).toHaveClass('my-own');
      expect($('#oh-yes')).toEqual($(this.view.render().el));
    });
  });
  describe("bindings", function() {
    beforeEach(function() {
      this.view = new FileShare.Views.FileList({
        collection: this.collection
      });
    });
    it("calls #addAll when the collection is refreshed", function() {
      expect(this.collectionBindSpy.calledWith('refresh', this.view.addAll));
    });
    it("calls #remove when an item is removed from the collection", function() {
      expect(this.collectionBindSpy.calledWith('remove', this.view.remove));
    });
    it("calls #update when an item in the collection changes", function() {
      expect(this.collectionBindSpy.calledWith('change', this.view.update));
    });
    it("calls #addOne when an item is added to the collection", function() {
      expect(this.collectionBindSpy.calledWith('add', this.view.addOne));
    });
  });
  describe("update file", function() {
    beforeEach(function() {
      this.view = new FileShare.Views.FileList({
        collection: this.collection
      });
      sinon.stub(this.view, 'addOne');
      sinon.stub(this.view, 'removeOne');
    });
    it("removes then adds the file view", function() {
      this.view.update(this.file1);
      expect(this.view.removeOne).toHaveBeenCalledOnce();
      expect(this.view.addOne).toHaveBeenCalledOnce();
    });
  });
  describe("addOne file", function() {
    beforeEach(function() {
      this.view = new FileShare.Views.FileList({
        collection: this.collection
      });
      sinon.stub(this.view, 'fileView');
      sinon.stub(this.view, 'insert');
      this.view.addOne(this.file1);
    });
    afterEach(function() {
      $('#fs_file_list').remove();
    });
    it("calls #fileView file", function() {
      expect(this.view.fileView).toHaveBeenCalledWithExactly(this.file1);
    });
    it("calls #insert file", function() {
      expect(this.view.insert).toHaveBeenCalledWithExactly(this.file1);
    });
  });
  describe("fileView file", function() {
    beforeEach(function() {
      this.fileView = sinon.mock(Backbone, 'View');
      this.fileViewStub = sinon.stub(FileShare.Views, 'FileAttachment')
        .returns(this.fileView);
      this.view = new FileShare.Views.FileList({
        collection: this.collection
      });
    });
    it("instantiates a new FileShare.Views.FileAttachment with a model of file and an id of 'file_attachment_'+model.id", function() {
      this.view.fileView(this.file1);
      expect(this.fileViewStub).toHaveBeenCalledWithExactly({
        model: this.file1,
        id: 'file_attachment_'+this.file1.id
      });
    });
  });
  describe("insert file", function() {
    beforeEach(function() {
      $('body').append($('<div id="fs_file_list"></div>'));
      this.collection = new Backbone.Collection(this.file1, this.file2);
      this.file1.view = new Backbone.View();
      this.file1.view.el = '<p id="test-insert-file-view" class="file_attachment"></p>';
      this.file2.view = new Backbone.View();
      this.file2.view.el = '<p id="test2-insert-file-view" class="file_attachment"></p>';
      this.view = new FileShare.Views.FileList({
        collection: this.collection
      });
    });
    afterEach(function() {
      $('#fs_file_list').remove();
    });
    it("prepends the first file in the collection to the top of the list", function() {
      sinon.stub(this.collection, 'indexOf').returns(0);
      this.view.insert(this.file1);
      expect($('#fs_file_list')).toContain('p#test-insert-file-view');
    });
    it("inserts subsequent files after their ordered predecessor in the collection", function() {
      $('#fs_file_list').prepend(this.file1.view.el);
      sinon.stub(this.collection, 'indexOf').returns(1);
      this.view.insert(this.file2);
      expect($('#fs_file_list').children().first()).toBe('p#test-insert-file-view');
      expect($('#fs_file_list').children().last()).toBe('p#test2-insert-file-view');
    });
  });
});