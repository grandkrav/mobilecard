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
  'formatter',
  'ui'
], function (chai, $, Formatter, ui) {


// Cache me
var should = chai.should(),
    assert = chai.assert;

// Need to store init state so we can reset after each test
var content = document.getElementById('test-content'),
    contentHTML = content.innerHTML;

// Scope vars
var $mobilecard, form, num, exp, cvc;

//
// Helper method to deep extend obj
//
var testDisplayFieldStatus = function () {
  it('Should add/change color to red if invalid', function () {
    ui.displayFieldStatus({ el: num }, false);
    assert.equal(num.style['color'], 'rgb(255, 0, 0)');
  });
  it('Should remove color if valid', function () {
    ui.displayFieldStatus({ el: num }, true);
    assert.equal(num.style['color'], '');
  });
};

//
// Set the focus and caret position on a new input
//
var testFocus = function () {
  it('Should focus on the desired element', function () {
    ui.focus({ el: exp, lastSel: 0 });
    assert.equal(document.activeElement, exp);
  });
  it('Should set the correct caret position', function () {
    num.value = '1234'
    ui.focus({ el: num, lastSel: 4 });
    assert.equal(document.activeElement.selectionStart, 4);
  });
};

//
// Reset number field formatter pattern
//
var testUpdateNum = function () {
  it('Should add formatter if not present', function () {
    var pattern = '{{9999}} {{999999}} {{99999}}';
        field   = { el: num };

    ui.updateNum(field, {
      format: pattern,
      lengths: { num: 4 }
    });
    assert.equal(field.formatter.opts.pattern, pattern);
  });
  it('Should change formatter pattern to match type', function () {
    var curPattern = '{{9999}} {{9999}} {{9999}} {{9999}}',
        newPattern = '{{9999}} {{999999}} {{99999}}',
        field      = { el: num };

    field.formatter = new Formatter(field.el, {
      pattern: curPattern
    });
    ui.updateNum(field, {
      format: newPattern,
      lengths: { num: 4 }
    });
    assert.equal(field.formatter.opts.pattern, newPattern);
  });
};

//
// Update maxLength of cvc field
//
var testUpdateCvc = function () {
  it('Should change maxLength to match type', function () {
    ui.updateCvc({ el: cvc }, {
      lengths: { cvc: 4 }
    });
    assert.equal(cvc.getAttribute('maxLength'), 4);
  });
};

//
// Update maxLength of specified field
//
var testShowNum = function () {
  beforeEach(function () {
    num.value = '123456781234567';
    ui.init();
    ui.showNum();
  });

  it('Should addClass', function () {
    assert.isTrue($mobilecard.hasClass('entering-number'));
  });
  it('Should set -webkit-transform', function () {
    assert.equal(num.style['-webkit-transform'], 'translate3d(0px, 0px, 0px)');
  });
};

//
// Update maxLength of specified field
//
var testHideNum = function () {
  beforeEach(function () {
    num.value = '123456781234567';
    ui.init();
    ui.hideNum();
  });

  it('Should removeClass', function () {
    assert.isFalse($mobilecard.hasClass('entering-number'));
  });
  it('Should set -webkit-transform', function () {
    assert.notEqual(num.style['-webkit-transform'], 'translate3d(0px, 0px, 0px)');
  });
};

// test please
describe('ui', function () {
  // Setup before each
  beforeEach(function () {
    form = document.getElementById('payments');
    num = form['card_number'];
    exp = form['exp_date'];
    cvc = form['cvc'];
    $mobilecard = $('.mobilecard');
  });
  // Reset HTML
  afterEach(function () {
    content.innerHTML = contentHTML;
  });

  // Tests
  describe('displayFieldStatus', testDisplayFieldStatus);
  describe('updateNum', testUpdateNum);
  describe('updateCvc', testUpdateCvc);
  describe('showNum', testShowNum);
  describe('hideNum', testHideNum);
  describe('foucs', testFocus);
});


});