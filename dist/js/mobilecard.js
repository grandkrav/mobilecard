;(function (name, context, definition) {
  if (typeof module !== 'undefined' && module.exports) { module.exports = definition(); }
  else if (typeof define === 'function' && define.amd) { define([
  	'jquery',
  	'formatter'
  ], definition); }
  else { context[name] = definition(); }
})('mobilecard', this, function (jquery, formatter) {

var ui = function ($, Formatter) {
        var $mobilecard, $num;
        var getMaxLength = function (field) {
            return field.el.getAttribute('maxLength');
        };
        var addKeyUpListener = function (field, handler) {
            $(field.el).on('keyup', handler);
        };
        var focus = function (field) {
            field.el.setSelectionRange(field.lastSel, field.lastSel);
            field.el.focus();
        };
        var displayFieldStatus = function (field, isValid) {
            $(field.el).css({ color: isValid ? '' : 'rgb(255, 0, 0)' });
        };
        var addExpFormatter = function (field) {
            field.formatter = new Formatter(field.el, { pattern: '{{99}}/{{99}}' });
        };
        var updateNum = function (field, type) {
            if (field.formatter) {
                field.formatter.resetPattern(type.format);
                field.el.setAttribute('maxLength', type.lengths.num);
            } else {
                field.formatter = new Formatter(field.el, { pattern: type.format });
            }
        };
        var updateCvc = function (field, type) {
            field.el.setAttribute('maxLength', type.lengths.cvc);
        };
        var updateDisplay = function (xPos, method) {
            $num.css({ '-webkit-transform': 'translate3d(' + xPos + 'px, 0px, 0px)' });
            $mobilecard[method]('entering-number');
        };
        var showNum = function (field) {
            updateDisplay(0, 'addClass');
            $num.off('touchend');
        };
        var hideNum = function (field) {
            updateDisplay(_getAnimDist(), 'removeClass');
            $num.on('touchend', function (evt) {
                showNum(field);
                focus(field);
            });
        };
        var _getAnimDist = function () {
            var numEl = $num[0], value = numEl.value, length = value.length, hide = value.slice(0, length - 4);
            return -_getWidth(numEl, hide);
        };
        var _getWidth = function (el, str) {
            var elStyles = window.getComputedStyle(el).cssText, fnStyles = 'position: absolute; top: -10000px; width: auto;';
            var $dummy = $('<div>').attr('style', elStyles + fnStyles).text(str);
            $dummy.appendTo(document.body);
            var result = $dummy.width();
            $dummy.remove();
            return result;
        };
        var init = function () {
            $mobilecard = $('.mobilecard');
            $num = $mobilecard.find('.input-number > input');
        };
        return {
            displayFieldStatus: displayFieldStatus,
            addKeyUpListener: addKeyUpListener,
            addExpFormatter: addExpFormatter,
            getMaxLength: getMaxLength,
            updateDisplay: updateDisplay,
            updateNum: updateNum,
            updateCvc: updateCvc,
            showNum: showNum,
            hideNum: hideNum,
            focus: focus,
            init: init
        };
    }(jquery, formatter);
var cards = function () {
        var defaultFormat = '{{9999}} {{9999}} {{9999}} {{9999}}', amexFormat = '{{9999}} {{999999}} {{99999}}';
        var cards = [
                {
                    type: 'discover',
                    pattern: /^(6011|65|64[4-9]|622)/,
                    format: defaultFormat,
                    lengths: {
                        num: 19,
                        cvc: 3
                    }
                },
                {
                    type: 'mastercard',
                    pattern: /^5[1-5]/,
                    format: defaultFormat,
                    lengths: {
                        num: 19,
                        cvc: 3
                    }
                },
                {
                    type: 'amex',
                    pattern: /^3[47]/,
                    format: amexFormat,
                    lengths: {
                        num: 17,
                        cvc: 4
                    }
                },
                {
                    type: 'visa',
                    pattern: /^4/,
                    format: defaultFormat,
                    lengths: {
                        num: 19,
                        cvc: 3
                    }
                },
                {
                    type: 'default',
                    pattern: /\d*/,
                    format: defaultFormat,
                    lengths: {
                        num: 19,
                        cvc: 3
                    }
                }
            ];
        var matchPattern = function (val) {
            var length = cards.length;
            for (var i = 0; i < length; i++) {
                if (cards[i].pattern.test(val)) {
                    return cards[i];
                }
            }
        };
        return { matchPattern: matchPattern };
    }();
var utils = function () {
        var extend = function (dest) {
            for (var i = 1; i < arguments.length; i++) {
                dest = extendObj(dest, arguments[i]);
            }
            return dest;
        };
        var extendObj = function (dest, src) {
            for (var prop in src) {
                if (typeof src[prop] === 'object' && src[prop] !== null && !src[prop].tagName) {
                    dest[prop] = dest[prop] || {};
                    arguments.callee(dest[prop], src[prop]);
                } else {
                    dest[prop] = src[prop];
                }
            }
            return dest;
        };
        var getExpParts = function (str) {
            var parts = str.split('/');
            return {
                month: parts[0],
                year: '20' + parts[1]
            };
        };
        return {
            extend: extend,
            extendObj: extendObj,
            getExpParts: getExpParts
        };
    }();
var field = function (utils) {
        var Field = function (opts) {
            this.lastSel = 0;
            this.validation = {
                status: true,
                onKey: false
            };
            utils.extend(this, opts);
        };
        Field.prototype.validate = function () {
            this.validation.status = this.test(this.el.value);
            return this.validation.status;
        };
        Field.prototype.validateField = function () {
            this.displayStatus(this, this.validate());
            return this.validation.status;
        };
        return Field;
    }(utils);
var validate = function () {
        var card = function (str) {
            var val = str.replace(/[ -]+/g, ''), len = val.length, mul = 0, sum = 0, prodArr = [
                    [
                        0,
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8,
                        9
                    ],
                    [
                        0,
                        2,
                        4,
                        6,
                        8,
                        1,
                        3,
                        5,
                        7,
                        9
                    ]
                ];
            while (len--) {
                sum += prodArr[mul][parseInt(val.charAt(len), 10)];
                mul ^= 1;
            }
            return sum % 10 === 0 && sum > 0;
        };
        var exp = function (date) {
            var curDate = new Date(), curMonth = curDate.getMonth() + 1, curYear = curDate.getFullYear();
            if (date.year > curYear + 15 || date.month > 12) {
                return false;
            }
            if (date.year < curYear) {
                return false;
            }
            if (date.year > curYear) {
                return true;
            }
            return date.month >= curMonth;
        };
        var exactLength = function (str, length) {
            return str.length == length;
        };
        return {
            card: card,
            exp: exp,
            exactLength: exactLength
        };
    }();
var mobilecard = function (ui, cards, Field, validate, utils) {
        var form, evtCallback, card;
        var focus = function (field, dir, next) {
            var newField = fields.get(field, dir);
            newField.lastSel = dir > 0 ? 0 : newField.el.value.length;
            ui.focus(newField);
            if (typeof next == 'function') {
                next(field);
            }
        };
        var keyUp = function (evt, type) {
            var field = fields[type], sel = evt.target.selectionEnd, k = evt.which || evt.keyCode;
            if (field.before) {
                field.before(field.el.value);
            }
            if (field.validateOnInput && field.validation.onKey) {
                field.validateField();
            }
            if (field.prev || field.prev === null) {
                if (sel === 0 && field.lastSel === 0 && k == 8) {
                    return focus(field, -1, field.prev);
                }
            }
            if (field.next || field.next === null) {
                if (sel == ui.getMaxLength(field) && field.validateField()) {
                    return focus(field, 1, field.next);
                }
            }
            field.lastSel = field.el.value.length;
            validateFields();
        };
        var fields = {
                order: [],
                add: function (id, params) {
                    var name = params.name, el = form[name];
                    var opts = utils.extend({}, {
                            el: el,
                            index: this.order.length,
                            displayStatus: ui.displayFieldStatus
                        }, params);
                    this[id] = new Field(opts);
                    this.order.push(id);
                    ui.addKeyUpListener(this[id], function (evt) {
                        keyUp(evt, id);
                    });
                },
                get: function (field, dir) {
                    return this[this.order[field.index + dir]];
                }
            };
        var addFields = function () {
            fields.add('num', {
                name: 'card_number',
                validateOnInput: true,
                before: setCard,
                next: function (field) {
                    setTimeout(function () {
                        ui.hideNum(field);
                    }, 60);
                },
                test: validate.card
            });
            fields.add('exp', {
                name: 'exp_date',
                validateOnInput: true,
                prev: function (field) {
                    ui.showNum(field);
                },
                next: null,
                test: function (val) {
                    var info = utils.getExpParts(val);
                    return validate.exp(info);
                }
            });
            fields.add('cvc', {
                name: 'cvc',
                prev: null,
                next: null,
                test: function (val) {
                    return validate.exactLength(val, card.lengths.cvc);
                }
            });
            fields.add('zip', {
                name: 'zip',
                prev: null,
                test: function (val) {
                    return validate.exactLength(val, 5);
                }
            });
        };
        var validateFields = function () {
            var error = false;
            for (var key in fields) {
                if (fields[key] instanceof Field && !fields[key].validate()) {
                    return evtCallback(true);
                }
            }
            evtCallback(null);
        };
        var setCard = function (val) {
            var newCard = cards.matchPattern(val);
            if (newCard !== card) {
                card = newCard;
                ui.updateNum(fields['num'], card);
                ui.updateCvc(fields['cvc'], card);
            }
        };
        var data = function () {
            return {
                num: fields['num'].el.value,
                exp: utils.getExpParts(fields['exp'].el.value),
                cvc: fields['cvc'].el.value,
                zip: fields['zip'].el.value
            };
        };
        var init = function (formEl, next) {
            form = formEl;
            evtCallback = next;
            ui.init();
            addFields();
            ui.addExpFormatter(fields['exp']);
            setCard('');
        };
        return {
            init: init,
            data: data
        };
    }(ui, cards, field, validate, utils);
return mobilecard;

});