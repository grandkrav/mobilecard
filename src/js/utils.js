/*
 * utils.js
 *
 * Shared helper methods
 *
 */

define(function () {


//
// Helper to deep extend key value pairs from
// n objs to destination
//
var extend = function (dest) {
  for (var i = 1; i < arguments.length; i++) {
    dest = extendObj(dest, arguments[i]);
  }
  return dest;
};

//
// Helper method to deep extend obj
//
var extendObj = function(dest, src) {
  for (var prop in src) {
    if (typeof src[prop] === "object" && src[prop] !== null && !src[prop].tagName) {
      dest[prop] = dest[prop] || {};
      arguments.callee(dest[prop], src[prop]);
    } else {
      dest[prop] = src[prop];
    }
  }
  return dest;
};

//
// Create expiration date obj from MM/YY str
//
var getExpParts = function (str) {
  var parts = str.split('/');
  return {
    month: parts[0],
    year: '20' + parts[1]
  };
};

// Expose
return {
  extend: extend,
  extendObj: extendObj,
  getExpParts: getExpParts
};


});