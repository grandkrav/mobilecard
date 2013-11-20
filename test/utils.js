/*
 * test/utils.js:
 *
 * (C) 2013 First Opinion
 * MIT LICENCE
 *
 */ 

define([
  'chai',
  'utils'
], function (chai, utils) {


// Cache me
var should = chai.should(),
    assert = chai.assert;

//
// Helper method to deep extend obj
//
var testExtendObj = function () {
  it('Should handle merging nested objects', function () {
    var result = utils.extend({
      a: 'b',
      c: { d: 'z', f: 'g' }
    }, {
      c: { d: 'e' }
    });
    assert.deepEqual(result, {
      a: 'b',
      c: { d: 'e', f: 'g' }
    });
  });
};

//
// Helper to deep extend key value pairs from
// n objs to destination
//
var testExtend = function () {
  it('Should merge objects', function () {
    var result = utils.extend({
      a: 'b',
      c: 'z'
    }, {
      c: 'd',
      e: 'f',
    });
    assert.deepEqual(result, {
      a: 'b',
      c: 'd',
      e: 'f'
    });
  });
  it('Should give presidence based on order', function () {
    var result = utils.extend({
      a: 'b',
      c: 'z'
    }, {
      c: 'y',
      e: 'f',
    }, {
      c: 'd'
    });
    assert.deepEqual(result, {
      a: 'b',
      c: 'd',
      e: 'f'
    });
  });
};

//
// Create expiration date obj from MM/YY str
//
var testGetExpParts = function () {
  it('Should return an object with month and full year', function () {
    var result = utils.getExpParts('12/12');
    assert.deepEqual(result, {
      month: '12',
      year: '2012'
    });
  });
};

// Test please
describe('utils', function () {
  describe('extend', testExtend);
  describe('extendObj', testExtendObj);
  describe('getExpParts', testGetExpParts);
});


});