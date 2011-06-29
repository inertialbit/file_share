FileShare = {
  Models: {},
  Views: {},
  Collections: {},
  Controllers: {},
  Flash: '',
  init: function() {
    FileShare.FileAttachmentsController = new FileShare.Controllers.FileAttachments();
    Backbone.history.start();
    new FileShare.Views.FileAttachmentList();
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