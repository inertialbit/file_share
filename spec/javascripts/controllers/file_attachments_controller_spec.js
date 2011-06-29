describe("FileShare.Controllers.FileAttachments", function() {
  beforeEach(function() {
    this.controller = new FileShare.Controllers.FileAttachments
    this.collection = new Backbone.Collection();
    this.fetchSpy = jasmine.createSpy('fetch spy');
  });
  describe("init & routes", function() {
    it("resets window.location.hash", function() {
      window.location.hash = '#file_share/whatever'
      new FileShare.Controllers.FileAttachments
      expect(window.location.hash).toEqual('');
    });
    it("instantiates a FileAttachment Collection as FileShare.Files", function() {
      expect(FileShare.Files).toBeDefined();
    });
    it("routes file_share/:id to #edit", function() {
      expect(this.controller.routes['file_share/:id']).toEqual('edit');
    });
    it("routes file_share/delete/:id to #delete", function() {
      expect(this.controller.routes['file_share/delete/:id']).toEqual('delete');
    });
  });
  describe("#edit :id", function() {
    beforeEach(function() {
      loadFixtures('edit_form_template.html');
      loadFixtures('file_attachment_template.html');
      loadFixtures('user_message_template.html');
      fake_file = {
        toJSON: function() {
          return {cid: 1, id: 1, name: 'some_file.doc', updated_at: 201105233761742};
        },
        get: function(what) {
          var stuff = {
            name: 'some_file.doc',
            updated_at: 201105233761742
          }
          return stuff[what];
        }
      }
      spyOn(FileShare.Files, 'get').andReturn(fake_file);
    });
    it("gets the file with :id from the collection", function() {
      this.controller.edit(1);
      expect(FileShare.Files.get).toHaveBeenCalledWith(1);
    });
    describe("the file is found", function() {
      beforeEach(function() {
        //spyEditView = jasmine.createSpyObj('FileShare.Views.FileAttachmentEditForm', ['render']);
        spyOn(this.controller, 'editFormView').andCallThrough();
      });
      it("renders FileShare.Views.FileAttachmentEditForm", function() {
        this.controller.edit(1);
        expect(this.controller.editFormView).toHaveBeenCalled();
      });
    });
  });
});