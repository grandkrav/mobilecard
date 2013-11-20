/*
 * ui.js
 *
 * Object containing supported card types 
 *
 */

define([
  'jquery',
  'formatter',
], function ($, Formatter) {


// Scope vars
var $mobilecard, $num;

//
// Get maxLength of object is set
//
var getMaxLength = function (field) {
  return field.el.getAttribute('maxLength');
};

//
// Add keyup listener to each field
//
var addKeyUpListener = function (field, handler) {
  $(field.el).on('keyup', handler);
};

//
// Set the focus and caret position on a new input
//
var focus = function (field) {
  field.el.setSelectionRange(field.lastSel, field.lastSel);
  field.el.focus();
};

//
// Update field UI based on validity
//
var displayFieldStatus = function (field, isValid) {
  $(field.el).css({ color: isValid ? '' : 'rgb(255, 0, 0)' });
};

//
// Update formatter pattern of specified field
//
var addExpFormatter = function (field) {
  field.formatter = new Formatter(field.el, {
    pattern: '{{99}}/{{99}}'
  });
};

//
// Update formatter pattern of specified field
//
var updateNum = function (field, type) {
  if (field.formatter) {
    field.formatter.resetPattern(type.format);
    field.el.setAttribute('maxLength', type.lengths.num);
  } else {
    field.formatter = new Formatter(field.el, {
      pattern: type.format
    });
  }
};

//
// Update maxLength of specified field
//
var updateCvc = function (field, type) {
  field.el.setAttribute('maxLength', type.lengths.cvc);
};

//
// Update mobilecard display
//
var updateDisplay = function (xPos, method) {
  $num.css({
    '-webkit-transform': 'translate3d(' + xPos + 'px, 0px, 0px)'
  });
  $mobilecard[method]('entering-number');
};

//
// Display num field
//
var showNum = function () {
  updateDisplay(0, 'addClass');
  $num.off('touchend');
};

//
// Hide num field
//
var hideNum = function () {
  updateDisplay(_getAnimDist(), 'removeClass');
  $num.on('touchend', function (evt) {
    focus($num[0]);
  });
};

//
// This is necessary due to using a non monospaced font
//
var _getAnimDist = function () {
  // Get chars to hide
  var numEl  = $num[0],
      value  = numEl.value,
      length = value.length,
      hide   = value.slice(0, length - 4);

  // return distance measurement
  return -(_getWidth(numEl, hide));
};

//
// Get text width of a specified element.
//
var _getWidth = function (el, str) {
  // Create dummy elem and append
  var elStyles = window.getComputedStyle(el).cssText,
      fnStyles = 'position: absolute; top: -10000px; width: auto;';

  // Dummy element to grab width from
  var $dummy = $('<div>').attr('style', elStyles + fnStyles).text(str);
  $dummy.appendTo(document.body);

  // Get width
  var result = $dummy.width();

  // Clean up
  $dummy.remove();

  // Return result
  return result;
};

//
// Init module: call after documnent is ready
//
var init = function () {
  // Cache often used jquery items
  $mobilecard = $('.mobilecard');
  $num = $mobilecard.find('.input-number > input');
};

// Expose
return {
  displayFieldStatus: displayFieldStatus,
  addKeyUpListener: addKeyUpListener,
  addExpFormatter: addExpFormatter,
  getMaxLength: getMaxLength,
  updateDisplay: updateDisplay,
  updateNum: updateNum,
  updateCvc: updateCvc,
  showNum: showNum,
  hideNum: hideNum,
  focus: focus,
  init: init
};

  
});