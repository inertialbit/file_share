describe("FileShare.Collections.Files", function() {
  beforeEach(function() {
    subject = new FileShare.Collections.Files;
    fake_file = {
      get: function(what) {
        var stuff = {
          name: 'some_file.doc',
          updated_at: 201105231811363
        };
        return stuff[what];
      }
    };
  });
  it("is a collection of FileAttachment models", function() {
    expect(subject.model).toEqual(FileShare.Models.File);
  });
  it("has a uri of /file_attachments", function() {
    expect(subject.url).toEqual("/file_attachments");
  });
  it("sorts by file attachment name and updated_at attributes (in that order)", function() {
    expect(subject.comparator(fake_file)).toEqual('some_file.doc 201105231811363');
  });
});