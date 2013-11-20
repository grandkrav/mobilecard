/*
 * test/utils.js:
 *
 * (C) 2013 First Opinion
 * MIT LICENCE
 *
 */ 

define([
  'chai',
  'validate'
], function (chai, validate) {


// Cache me
var should = chai.should(),
    assert = chai.assert;

//
// Make sure we have a valid credit card number
//
var testCard = function () {
  it('Should return true if passes luhn check', function () {
    assert.isTrue(validate.card('4242424242424242'));
  });
  it('Should return false if fails luhn check', function () {
    assert.isFalse(validate.card('4242424242424244'));
  });
  it('Should handle spaces between chars', function () {
    assert.isTrue(validate.card('4242 4242 4242 4242'));
  });
  it('Should handle hyphens between chars', function () {
    assert.isTrue(validate.card('4242-4242-4242-4242'));
  });
};

//
// Make sure our expiration date falls within
// the correct ranges
//
var testExp = function () {
  it('Should return false if date is invalid', function () {
    assert.isFalse(validate.exp({
      month: 14,
      year: 2013
    }));
  });
  it('Should return false if date is past 15 years', function () {
    assert.isFalse(validate.exp({
      month: 12,
      year: (new Date()).getFullYear() + 16
    }));
  });
  it('Should return false if year is outdated', function () {
    assert.isFalse(validate.exp({
      month: 12,
      year: (new Date()).getFullYear() -1
    }));
  });
  it('Should return false if month is outdated', function () {
    assert.isFalse(validate.exp({
      month: (new Date()).getMonth(),
      year: (new Date()).getFullYear()
    }));
  });
  it('Should return true if date is valid', function () {
    assert.isTrue(validate.exp({
      month: (new Date()).getMonth() + 1,
      year: (new Date()).getFullYear()
    }));
  });
};

//
// Verify that str matches an exact length
//
var testExactLength = function () {
  it('Should return false if length is too long', function () {
    assert.isFalse(validate.exactLength('123456', 5));
  });
  it('Should return false if length is too short', function () {
    assert.isFalse(validate.exactLength('1234', 5));
  });
  it('Should return true if length matches', function () {
    assert.isTrue(validate.exactLength('12345', 5));
  });
};

// Test please
describe('validate', function () {
  describe('card', testCard);
  describe('exp', testExp);
  describe('exactLength', testExactLength);
});


});