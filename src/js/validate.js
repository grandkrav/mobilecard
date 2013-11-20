/*
 * verify.js
 *
 * Verify correct input values
 *
 */

define(function () {


//
// Make sure we have a valid credit card number
//
var card = function (str) {
  // Get field value
  var val = str.replace(/[ -]+/g,''),
      len = val.length,
      mul = 0,
      sum = 0,
      prodArr = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]
      ];

  while (len--) {
    sum += prodArr[mul][parseInt(val.charAt(len), 10)];
    mul ^= 1;
  }

  return sum % 10 === 0 && sum > 0;
};

//
// Make sure our expiration date falls within
// the correct ranges
//
var exp = function (date) {
  // Current date
  var curDate  = new Date(),
      curMonth = curDate.getMonth() + 1,
      curYear  = curDate.getFullYear();

  // Make sure date is past current date
  if (date.year > curYear + 15 || date.month > 12) { return false; }
  if (date.year < curYear) { return false; }
  if (date.year > curYear) { return true; }
  return date.month >= curMonth;
};

//
// Verify that str matches an exact length
//
var exactLength = function (str, length) {
  return (str.length == length);
};

// Expose
return {
  card: card,
  exp: exp,
  exactLength: exactLength
};


});