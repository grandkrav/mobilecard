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
// Return true/false if ui indicates user is entering a number
//
var isEnteringNumber = function (field) {
  return $mobilecard.hasClass('entering-number');
};

//
// Get maxLength of object is set
//
var getMaxLength = function (field) {
  return field.el.getAttribute('maxLength');
};

//
// Add keyup listener to field
//
var addKeyUpListener = function (field, handler) {
  $(field.el).on('keyup', handler);
};

//
// Add focus listener to field
//
var addFocusListener = function (field, handler) {
  $(field.el).on('focus', handler);
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
// Increment all tab indexes for round robin experience
//
var setReadOnly = function (field, isValid) {
  return isValid
    ? field.el.removeAttribute('readonly')
    : field.el.setAttribute('readonly');
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
  } else {
    field.formatter = new Formatter(field.el, {
      pattern: type.format
    });
  }
  // Maxlength
  field.el.setAttribute('maxLength', type.lengths.num);
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
var showNum = function (field) {
  updateDisplay(0, 'addClass');
  $num.off('touchend');
};

//
// Hide num field
//
var hideNum = function (field) {
  updateDisplay(_getAnimDist(), 'removeClass');
  $num.on('touchend', function (evt) {
    showNum(field);
    focus(field);
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
  isEnteringNumber: isEnteringNumber,
  addFocusListener: addFocusListener,
  addKeyUpListener: addKeyUpListener,
  addExpFormatter: addExpFormatter,
  setReadOnly: setReadOnly,
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