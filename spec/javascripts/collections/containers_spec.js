
describe("FileShare.Collections.Containers", function() {
  beforeEach(function() {
    subject = new FileShare.Collections.Containers;
  });
  it("is a collection of FileContainers models", function() {
    expect(subject.model).toEqual(FileShare.Models.Container);
  });
  it("has a uri of /file_containers", function() {
    expect(subject.url).toEqual("/file_containers");
  });
});