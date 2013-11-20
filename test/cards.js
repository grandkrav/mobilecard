/*
 * test/utils.js:
 *
 * (C) 2013 First Opinion
 * MIT LICENCE
 *
 */ 

define([
  'chai',
  'cards'
], function (chai, cards) {


// cache please
var should = chai.should(),
    assert = chai.assert;

//
// Determine card type by searching for a matching pattern
//
var testMatchCard = function () {
  it('Should return default card obj if no match found', function () {
    var card = cards.matchPattern('3');
    assert.equal(card.type, 'default');
  });
  it('Should return discover if discover pattern passed', function () {
    var card = cards.matchPattern('6011');
    assert.equal(card.type, 'discover');
  });
  it('Should return mastercard if mastercard pattern passed', function () {
    var card = cards.matchPattern('55');
    assert.equal(card.type, 'mastercard');
  });
  it('Should return amex if amex pattern passed', function () {
    var card = cards.matchPattern('34');
    assert.equal(card.type, 'amex');
  });
  it('Should return visa if visa pattern passed', function () {
    var card = cards.matchPattern('4');
    assert.equal(card.type, 'visa');
  });
};

// test please
describe('cards', function () {
  describe('matchCard', testMatchCard);
});


});