
describe("FileShare.Collections.FileContainers", function() {
  beforeEach(function() {
    subject = new FileShare.Collections.FileContainers;
  });
  it("is a collection of FileContainers models", function() {
    expect(subject.model).toEqual(FileShare.Models.FileContainer);
  });
  it("has a uri of /file_containers", function() {
    expect(subject.url).toEqual("/file_containers");
  });
});