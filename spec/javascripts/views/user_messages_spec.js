describe("FileShare.Views.UserMessage", function() {
  beforeEach(function() {
    this.clock = sinon.useFakeTimers();
    loadFixtures('user_message_template.html');
    this.message = "Hi there!";
    this.view = new FileShare.Views.UserMessage({
      message: this.message
    });
    $('body').prepend(this.view.el);
  });  
  afterEach(function() {
    this.clock.restore();
  });
  it("loads the user message template", function() {
    expect(this.view.template).toBeDefined();
  });
  it("renders before exiting init", function() {
    expect($('#user-message').html()).toContain(this.message);
  });
  describe("el", function() {
    it("has a class of notice by default", function() {
      expect(this.view.el.className).toEqual('notice');
    });
    it("has an id of user-message", function() {
      expect(this.view.el.id).toEqual('user-message');
    });
  });
  describe("render", function() {
    it("adds the template to the el's html", function() {
      expect($(this.view.el).html()).toContain(this.message);
    });
    describe("a #user-message element already exists", function() {
      it("replaces it with the new el", function() {
        expect($('.notice').length).toEqual(1);
        this.view.render();
        this.clock.tick(-6000) && expect($('.notice').length).toEqual(1);
      });
    });
    describe("a #user-message element does not exist", function() {
      beforeEach(function() {
        $('#user-message').remove();
        $('body').append('<div id="file_attachments"></div>');
      });
      afterEach(function() {
        $('#user-message').remove();
        $('#file_attachments').remove();
      });
      it("is prepended to the #file_attachments parent element", function() {
        expect($('.notice').length).toEqual(0);
        this.view.render();
        this.clock.tick(-6000) && expect($('.notice').length).toEqual(1);
      });
    });
    it("hides after a while", function() {
      this.clock.tick(6000);
      expect($('#user-message').filter(':visible').length).toEqual(0);
    });
  });
});