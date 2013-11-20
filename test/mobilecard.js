/*
 * test/utils.js:
 *
 * (C) 2013 First Opinion
 * MIT LICENCE
 *
 */ 

define([
  'chai',
  'jquery',
  'mobilecard',
  'sendkeys'
], function (chai, $, mobilecard) {


// cache please
var should = chai.should(),
    assert = chai.assert;

//
// Determine card type by searching for a matching pattern
//
var testModule = function () {
  mobilecard.init(document.getElementById('payments'), function (err) {
    console.log(err);
  });
};

// test please
describe('cards', function () {
  describe('Module', testModule);
});


});