/*
* cards.js
*
* Object containing supported card types 
*
*/

define(function () {


// Patterns used by formatter.js
var defaultFormat = '{{9999}} {{9999}} {{9999}} {{9999}}',
    amexFormat    = '{{9999}} {{999999}} {{99999}}';

// Obj containing supported chars
var cards = [
  {
    type: 'discover',
    pattern: /^(6011|65|64[4-9]|622)/,
    format: defaultFormat,
    lengths: { num: 19, cvc: 3 }
  }, {
    type: 'mastercard',
    pattern: /^5[1-5]/,
    format: defaultFormat,
    lengths: { num: 19, cvc: 3 }
  }, {
    type: 'amex',
    pattern: /^3[47]/,
    format: amexFormat,
    lengths: { num: 17, cvc: 4 }
  }, {
    type: 'visa',
    pattern: /^4/,
    format: defaultFormat,
    lengths: { num: 19, cvc: 3 }
  },
  {
    type: 'default',
    pattern: /\d*/,
    format: defaultFormat,
    lengths: { num: 19, cvc: 3 }
  }
];

//
// Determine card type by searching for a matching pattern
//
var matchPattern = function (val) {
  var length = cards.length;
  for (var i = 0; i < length; i++) {
    if(cards[i].pattern.test(val)) {
      return cards[i];
    }
  }
};

// Expose
return {
  matchPattern: matchPattern
};


});