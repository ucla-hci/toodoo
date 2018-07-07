//////////////////////////////////////////////////////////////////////////////
//
//  TooDoo - a todo list app
//
//  class file of a to-do item, v0.0
//  by xiangchen@acm.org 7/2018
//
//////////////////////////////////////////////////////////////////////////////

// namespace
var TOODOO = TOODOO || {};

// class constructor
TOODOO.Item = function(note, done) {
  this.note = note || "";
  this.done = done || false;
};

TOODOO.Item.prototype = {
  constructor: TOODOO.Item
};

// get the ui elements of this to do item
TOODOO.Item.prototype.getUI = function() {
  this.itemUI = $("<div/>");

  // checkbox to mark to do item as done/undone
  this.cbDone = $('<input type="checkbox">');
  this.cbDone.change(
    function() {
      this.check();
      this.updateUI();
    }.bind(this)
  );
  this.itemUI.append(this.cbDone);

  // input field to display to do notes
  this.inputNote = $('<input type="text"/>');
  this.inputNote.css('class', 'ui-widget');
  this.inputNote.val(this.note);
 
  // update note when a user is editing
  this.inputNote.on('keyup', function(event) {
    this.note = this.inputNote.val();
    if (event.which == 13) {  // 'enter' key
      TOODOO.updateUI();
    }
  }.bind(this));
  this.itemUI.append(this.inputNote);

  // deal with empty to do item
  if (this.note.length > 0) {
    if (this.done) this.cbDone.prop("checked", true);
    this.cbDone.prop("disabled", false);
    this.inputNote.css('border', 'none');
    this.updateUI();
  } else {
    this.cbDone.prop("disabled", true);
  }

  return this.itemUI;
};

// update the done status
TOODOO.Item.prototype.check = function() {
  this.done = !this.done;
}

// update the ui elements of the to do item
TOODOO.Item.prototype.updateUI = function() {
  if (this.cbDone.is(":checked")) {
    this.inputNote.css("text-decoration", "line-through");
    this.inputNote.css("opacity", "0.3");
  } else {
    this.inputNote.css("text-decoration", "none");
    this.inputNote.css("opacity", "1.0");
  }
}