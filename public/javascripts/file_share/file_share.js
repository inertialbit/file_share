FileShare = {
  Models: {},
  Views: {},
  Collections: {},
  Routers: {},
  Flash: '',
  init: function() {
    FileShare.Files = new FileShare.Collections.Files();
    FileShare.FileAttachmentsController = new FileShare.Routers.File();
    Backbone.history.start();
    new FileShare.Views.FileList({
      collection: FileShare.Files,
      id: 'file_attachments'
    });
  }
}

FileShare.Effects = {
  messageFade: function(selector) {
    var hide = function() { $(selector).fadeOut(); }
    _.delay(hide, 3000);
  }
}

function to_mebibytes(bytes) {
  var mebibytes = bytes / (1024 * 1024);
  if( mebibytes < 1 ) {
    var kibibytes = bytes / 1024;
    return kibibytes.toFixed(2) + " KiB";
  } else {
    return mebibytes.toFixed(2) + " MiB";
  }
}

/*
jQuery(function($) {
  $('a.show_hide_link').attach(ShowHideLink);
});
*/
/*
http://www.learningjquery.com/2007/08/clearing-form-data
*/
/*
$.fn.clearForm = function() {
  return this.each(function() {
    var type = this.type, tag = this.tagName.toLowerCase();
    if (tag == 'form')
      return $(':input',this).clearForm();
    if (type == 'text' || type == 'password' || tag == 'textarea')
      this.value = '';
    else if (type == 'checkbox' || type == 'radio')
      this.checked = false;
    else if (tag == 'select')
      this.selectedIndex = -1;
  });
};
*/