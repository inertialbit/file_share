describe("FileShare.Views.FileAttachment", function() {
  beforeEach(function() {
    loadFixtures('file_attachment_template.html');
    this.file = new Backbone.Model({
      id: 1,
      name: 'test-file.txt',
      description: '',
      attachable_name: 'MyFolder',
      attachable_type: 'Folder'
    });
    this.view = new FileShare.Views.FileAttachment({
      id: 'file-attachment-fixture',
      model: this.file
    });
  });
  describe("el", function() {
    it("has a class of file_attachment", function() {
      expect(this.view.el.className).toContain('file_attachment');
    });
  });
  describe("events", function() {
    beforeEach(function() {
      $('body').append(this.view.el);
    });
    afterEach(function() {
      $(this.view.el).remove();
    });
    describe("mouseover", function() {
      it("shows any .fake_button elements", function() {
        $(this.view.el).mouseover();
        expect(this.view.$('.fake_button').filter(':visible').length)
          .toEqual(this.view.$('.fake_button').length);
      });
    });
    describe("mouseout", function() {
      it("hides any .fake_button elements", function() {
        $(this.view.el).mouseover();
        $(this.view.el).mouseout();
        expect(this.view.$('.fake_button').filter(':hidden').length)
          .toEqual(this.view.$('.fake_button').length);
      });
    });
  });
  describe("render", function() {
    beforeEach(function() {
      this.getStub = sinon.stub(this.file, 'get');
    });
    it("renders the name template, if file has a name", function() {
      this.getStub.withArgs('name').returns('my-file.txt');
      this.view.render();
      expect(this.view.$('p.name').length).toEqual(1);
      
      this.getStub.withArgs('name').returns(null);
      this.view.render();
      expect(this.view.$('p.name').length).toEqual(0);
    });
    it("renders the description template, if file has a description", function() {
      this.getStub.withArgs('description').returns('blah');
      this.view.render();
      expect(this.view.$('p.description').length).toEqual(1);
      
      this.getStub.withArgs('description').returns(null);
      this.view.render();
      expect(this.view.$('p.description').length).toEqual(0);
    });
    it("renders the container template, if file has a container", function() {
      this.getStub.withArgs('attachable_name').returns('Job Fair');
      this.getStub.withArgs('attachable_type').returns('Event');
      this.view.render();
      expect(this.view.$('p.attachable').length).toEqual(1);
      
      this.getStub.withArgs('attachable_name').returns(null);
      this.getStub.withArgs('attachable_type').returns(null);
      this.view.render();
      expect(this.view.$('p.attachable').length).toEqual(0);
    });
    it("hides any .fake_button elements", function() {
      expect(this.view.$('.fake_button').filter(':hidden').length)
        .toEqual(this.view.$('.fake_button').length);
    });
  });
  describe("templates property", function() {
    it("exists", function() {
      expect(this.view.templates).toBeDefined();
    });
    it("has a container template", function() {
      expect(this.view.templates.container).toBeDefined();
    });
    it("has a description template", function() {
      expect(this.view.templates.description).toBeDefined();
    });
    it("has a name template", function() {
      expect(this.view.templates.name).toBeDefined();
    });
    it("allows templates to be overridden during init", function() {
      $('body').append('<script type="text/template" id="test-container"><h1>{{ attachable_type }}::{{ attachable_name }}</h1></script>');
      $('body').append('<script type="text/template" id="test-name"><p>{{ name }}</p></script>');
      $('body').append('<script type="text/template" id="test-description"><pre>{{ description }}</pre></script>');
      var view = new FileShare.Views.FileAttachment({
        id: 'test-file-attachment',
        model: this.file,
        template_ids: {
          container: 'test-container',
          name: 'test-name',
          description: 'test-description'
        }
      });
      $('body').append(view.el);
      expect($('#test-file-attachment').find('h1')).toHaveText('Folder::MyFolder');
      $(view.el).remove();
      $('#test-container').remove();
      $('#test-name').remove();
      $('#test-description').remove();
    });
  });
});