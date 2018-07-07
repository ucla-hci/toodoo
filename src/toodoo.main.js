//////////////////////////////////////////////////////////////////////////////
//
//  TooDoo - a todo list app
//
//  main backend js, v0.0
//  by xiangchen@acm.org 7/2018
//
//////////////////////////////////////////////////////////////////////////////

// namespace
var TOODOO = TOODOO || {};

// initialize the app (upon page ready)
$(document).ready(function() {
  // load config file
  YAML.load("config.yml", function(result) {
    Object.assign(TOODOO, result);

    // load data
    YAML.load(TOODOO.DATAFILE, function(result) {
      TOODOO.items = [];
      for (let item of result.items) {
        TOODOO.items.push(new TOODOO.Item(item.note, item.done));
      }

      // now ready, update ui for the first time
      TOODOO.updateUI();
    });
  });
});

// update ui
TOODOO.updateUI = function() {
  // rearrange to do items based on what's been done
  TOODOO.rearrangeItems();

  // clear the list
  TOODOO.list = $('#divList');
  TOODOO.list.empty();

  // populate the list with the uis of each to do item
  for (var item of TOODOO.items) {
    TOODOO.list.append(item.getUI());
    item.cbDone.on('change', function() {
      TOODOO.updateUI();
    });
  }

  // a special empty item to let the user create new to do item
  var itemEmpty = new TOODOO.Item('', false, true);
  var uiItemEmpty = itemEmpty.getUI();
  uiItemEmpty.on('keydown', function(event) {
    if (event.which == 13) {  // 'enter' key
      TOODOO.items.push(new TOODOO.Item(this.note, false));
      TOODOO.updateUI();
    }
  }.bind(itemEmpty))
  TOODOO.list.append(uiItemEmpty);
};

// rearrange to do items:
// scan through the entire list and move done items to the top
TOODOO.rearrangeItems = function() {
  for (var i = 0; i < TOODOO.items.length; i++) {
    if (TOODOO.items[i].done) {
      for (var j = i; j > 0; j--) {
        // if the next item up is done or it has already reached the top
        if (TOODOO.items[j-1].done || j==1) {
          // insert (a copy of) the done item here
          TOODOO.items.splice(j, 0, TOODOO.items[i]);
          // remove the (original) done item at its previous position
          TOODOO.items.splice(i+1, 1);
          break;
        }
      }
    }
  }
}