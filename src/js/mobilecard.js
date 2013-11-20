/*
 * card.js
 *
 * The glue that holds it all together
 *
 */

define([
  'ui',
  'cards',
  'field',
  'validate',
  'utils',
], function (ui, cards, Field, validate, utils) {


// Scope vars
var form, evtCallback, card;

//
// Set the focus and caret position on a new input
//
var focus = function (field, dir, next) {
  // Setup new field
  var newField = fields.get(field, dir);
  // Set lastSel
  newField.lastSel = dir > 0 ? 0 : newField.el.value.length;

  // Focus
  ui.focus(newField);
  // Calback if exists
  if (typeof next == 'function') { next(); }
};

//
// Handle all key events. Dispactch specific handlers
//
var keyUp = function (evt, type) {
  // Get evt info
  var field = fields[type],
      sel   = evt.target.selectionEnd,
      k     = evt.which || evt.keyCode;

  // before
  if (field.before) {
    field.before(field.el.value);
  }
  // onKey validation
  if (field.validateOnInput && field.validation.onKey) {
    field.validateField();
  }
  // prev
  if (field.prev || field.prev === null) {
    if (sel === 0 && field.lastSel === 0 && k == 8) {
      return focus(field, -1, field.prev);
    }
  }
  // next
  if (field.next || field.next === null) {
    if (sel == ui.getMaxLength(field) && field.validateField()) {
      return focus(field, 1, field.next);
    }
  }

  // lastSel should be equal to the last char entered
  field.lastSel = field.el.value.length;

  // Validate all fields
  validateFields();
};

//
// Store fields. Contains helper methods, props
// for adding and accesing indivudual field instances
//
var fields = {
  // Hold order of fields in input
  order: [],
  
  //
  // Create and add new field instance
  //
  add: function (id, params) {
    var name = params.name,
        el   = form[name];

    // Mixin params with defaults
    var opts = utils.extend({}, {
      el: el,
      index: this.order.length,
      displayStatus: ui.displayFieldStatus
    }, params);

    // Create field and set order
    this[id] = new Field(opts);
    this.order.push(id);

    // Add keyup listener
    ui.addKeyUpListener(this[id], function (evt) {
      keyUp(evt, id);
    });
  },

  //
  // Get field in a specified direction
  //
  get: function (field, dir) {
    return this[this.order[field.index + dir]];
  }
};

//
// Populate fields obj by adding individual field instances
// NOTE: Fields must be added in the correct order
//
var addFields = function () {
  // Credit Card Number
  fields.add('num', {
    name: 'card_number',
    validateOnInput: true,
    before: setCard,
    next: function () {
      // Delay to fix transition lag
      setTimeout(ui.hideNum, 60);
    },
    test: validate.card
  });

  // Expiration Date
  fields.add('exp', {
    name: 'exp_date',
    validateOnInput: true,
    prev: ui.showNum,
    next: null,
    test: function (val) {
      var info = utils.getExpParts(val);
      return validate.exp(info);
    }
  });

  // CVC
  fields.add('cvc', {
    name: 'cvc',
    prev: null,
    next: null,
    test: function (val) {
      return validate.exactLength(val, card.lengths.cvc);
    }
  });

  // ZIP
  fields.add('zip', {
    name: 'zip',
    prev: null,
    test: function (val) {
      return validate.exactLength(val, 5);
    }
  });
};

//
// Validate all fields.
//
var validateFields = function () {
  // Validate all
  var error = false;
  for (var key in fields) {
    if (fields[key] instanceof Field && !fields[key].validate()) {
      return evtCallback(true);
    }
  }
  evtCallback(null);
};

//
// Set card obj and update display
//
var setCard = function (val) {
  card = cards.matchPattern(val);
  ui.updateNum(fields['num'], card);
  ui.updateCvc(fields['cvc'], card);
};

//
// Init module: call after documnent is ready
//
var init = function (formEl, next) {
  // Save passed params
  form = formEl;
  evtCallback = next;

  // Init ui
  ui.init();
  addFields();
  ui.addExpFormatter(fields['exp']);
  setCard('');
};

// Expose
return {
  init: init
};

  
});