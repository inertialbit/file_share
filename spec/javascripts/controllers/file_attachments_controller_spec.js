var getByIdFromCollection = function(id, spec) {
  spec.expect(spec.collection.get).toHaveBeenCalledWithExactly(id);
}
describe("FileShare.Controllers.FileAttachments", function() {
  beforeEach(function() {
    this.controller = new FileShare.Controllers.FileAttachments;
    this.collection = new Backbone.Collection();
    this.file = new Backbone.Model();
    
    FileShare.Files = this.collection;
    
    this.getStub = sinon.stub(this.collection, 'get');
    this.removeStub = sinon.stub(this.collection, 'remove');
    this.editFormStub = sinon.stub(this.controller, 'editFormView')
      .returns(new Backbone.View());
    this.userMessageStub = sinon.stub(this.controller, 'userMessageView')
      .returns(new Backbone.View());
    this.formMessageStub = sinon.stub(this.controller, 'formMessageView')
      .returns(new Backbone.View());
  });
  describe("init & routes", function() {
    it("resets window.location.hash", function() {
      window.location.hash = '#file_share/whatever';
      new FileShare.Controllers.FileAttachments;
      expect(window.location.hash).toEqual('');
    });
    it("routes file_share/:id to #edit", function() {
      expect(this.controller.routes['file_share/:id']).toEqual('edit');
    });
    it("routes file_share/delete/:id to #delete", function() {
      expect(this.controller.routes['file_share/delete/:id']).toEqual('delete');
    });
  });
  describe("#edit :id", function() {
    it("gets the file with :id from the collection", function() {
      this.controller.edit(1);
      getByIdFromCollection(1, this);
    });
    describe("the file is found", function() {
      beforeEach(function() {
        this.getStub.returns(this.file);
      });
      it("renders FileShare.Views.FileAttachmentEditForm", function() {
        this.controller.edit(1);
        expect(this.editFormStub).toHaveBeenCalledWithExactly(this.file);
      });
    });
    describe("the file is not found", function() {
      beforeEach(function() {
        this.getStub.returns(null);
      });
      it("renders FileShare.Views.UserMessage", function() {
        this.controller.edit(1);
        expect(this.userMessageStub).toHaveBeenCalledWithExactly("File not found.");
      });
    });
  });
  describe("#editFormView file", function() {
    beforeEach(function() {
      sinon.stub(FileShare.Views, 'FileEditForm')
        .returns(new Ba);
    });
  });
  describe("#update file", function() {
    it("saves the file", function() {
      sinon.stub(this.file, 'save');
      this.controller.update(this.file);

      expect(this.file.save).toHaveBeenCalledOnce();
    });
    it("updates the file name, description, file_container", function() {
      sinon.stub(this.file, 'save');
      sinon.stub(this.controller, 'getFileName').returns('new name');
      sinon.stub(this.controller, 'getFileDescription').returns('new description');
      sinon.stub(this.controller, 'getFileContainer').returns('container_1');
      this.controller.update(this.file);

      expect(this.file.save.args[0][0]).toEqual({
        name: 'new name',
        description: 'new description',
        file_container: 'container_1'
      });
    });
    describe("update succeeds :)", function() {
      it("removes the edit form view", function() {
        sinon.stub(this.controller, 'removeEditFormView');
        sinon.stub(this.file, 'save').yieldsTo('success', [this.file, '']);
        this.controller.update(this.file);
        
        expect(this.controller.removeEditFormView).toHaveBeenCalled();
        expect(this.controller.removeEditFormView.args[0][0][0]).toEqual(this.file);
      });
    });
    describe("update fails :(", function() {
      it("renders FileShare.Views.FormMessage to display errors", function() {
        sinon.stub(this.file, 'save').yieldsTo('error', this.file, {
          errors: ['err 1', 'err 2']
        });
        this.controller.update(this.file);
        
        expect(this.formMessageStub).toHaveBeenCalledWith({
          className: 'error small_text',
          model: this.file,
          errors: ['err 1', 'err 2']
        });
      });
    });
    it("resets window.location.hash to #", function() {
      sinon.stub(this.file, 'save');
      window.location.hash = '#file_share/whatever';
      this.controller.update(this.file);
      
      expect(window.location.hash).toEqual('');
    });
  });
  describe("delete :id", function() {
    beforeEach(function() {
      this.destroyStub = sinon.stub(this.file, 'destroy');
      this.confirmStub = sinon.stub(window, 'confirm');
    });
    afterEach(function() {
      window.confirm.restore();
    });
    it("gets the file with :id from the collection", function() {
      this.controller.delete(1);
      getByIdFromCollection(1, this);
    });
    describe("the file is found", function() {
      beforeEach(function() {
        this.getStub.returns(this.file);
      });
      it("requests confirmation from the user", function() {
        this.controller.delete(1);
        expect(this.confirmStub).toHaveBeenCalled();
      });
      describe("user confirms", function() {
        beforeEach(function() {
          this.confirmStub.returns(true);
        });
        it("destroys the file", function() {
          this.controller.delete(1);
          expect(this.file.destroy).toHaveBeenCalled();
        });
        describe("the file is destroyed", function() {
          beforeEach(function() {
            this.destroyStub.yieldsTo('success', this.file, {});
            this.controller.delete(1);
          });
          it("removes the file from the collection", function() {
            expect(this.removeStub).toHaveBeenCalled();
          });
          it("renders a userMessageView", function() {
            expect(this.userMessageStub).toHaveBeenCalled();
          });
        });
        describe("the file is not destroyed", function() {
          it("renders a userMessageView", function() {
            this.destroyStub.yieldsTo('error', this.file, {});
            this.controller.delete(1);
            expect(this.userMessageStub).toHaveBeenCalled();
          });
        });
      });
    });
    describe("the file is not found", function() {
      it("renders a userMessageView", function() {
        this.getStub.returns(null);
        this.controller.delete(1);
        expect(this.userMessageStub).toHaveBeenCalled();
      });
    });
    it("resets window.location.hash to #", function() {
      window.location.hash = '#file_share/whatever';
      this.controller.delete(1);

      expect(window.location.hash).toEqual('');
    });
  });
});