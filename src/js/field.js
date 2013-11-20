/*
 * field.js
 *
 * Class used to hold field information.
 *
 */

define([
  'utils'
], function (utils) {


//
// Field class. Keeps track of validation, state,
// and behavior.
//
var Field = function (opts) {
  // Defaults
  this.lastSel = 0;
  this.validation = {
    status: true,
    onKey: false
  };
  // Mixin
  utils.extend(this, opts);
};

//
// Wrapper that validates field and then updates both the
// display and internal status
//
Field.prototype.validate = function () {
  this.validation.status = this.test(this.el.value);
  return this.validation.status;
};

Field.prototype.validateField = function () {
  this.displayStatus(this, this.validate());
  return this.validation.status;
};

// Expose
return Field;


});