;(function (name, context, definition) {
  if (typeof module !== 'undefined' && module.exports) { module.exports = definition(); }
  else if (typeof define === 'function' && define.amd) { define([
  	'jquery',
  	'formatter'
  ], definition); }
  else { context[name] = definition(); }
})('mobilecard', this, function (jquery, formatter) {
