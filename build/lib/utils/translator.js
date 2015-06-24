"use strict";

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

define(["./browser-polyfill"], function () {
    var translator = undefined;

    // Matches optional type annotations in i18n strings.
    // e.g. i18n`This is a number ${x}:n(2)` formats x as number
    //      with two fractional digits.
    var typeInfoRegex = /^:([a-z])(\((.+)\))?/;

    translator = function (_ref) {
        var locale = _ref.locale;
        var defaultCurrency = _ref.defaultCurrency;
        var messageBundle = _ref.messageBundle;

        return function (literals) {
            for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                values[_key - 1] = arguments[_key];
            }

            if (!Array.isArray(literals)) {
                literals = [literals];
            }
            var translationKey = translator.buildKey(literals);
            var translationString = messageBundle[translationKey];

            if (translationString) {
                var _ret = (function () {
                    var typeInfoForValues = literals.slice(1).map(translator.extractTypeInfo);
                    var localizedValues = values.map(function (v, i) {
                        return translator.localize(locale, v, typeInfoForValues[i]);
                    });
                    return {
                        v: translator.buildMessage.apply(translator, [translationString].concat(_toConsumableArray(localizedValues)))
                    };
                })();

                if (typeof _ret === "object") return _ret.v;
            }

            if (translator.logging) {
                console.warn("Translation missing '" + translationKey + "'");
            }

            return translationKey;
        };
    };

    Object.assign(translator, {
        defaultCurrency: "EURO",
        logging: true,
        localizers: {
            /*string*/
            s: function (locale, v) {
                return v.toLocaleString(locale);
            },

            /*currency*/
            c: function (locale, v, currency) {
                return v.toLocaleString(locale, {
                    style: "currency",
                    currency: currency || translator.defaultCurrency
                });
            },

            /*number*/
            n: function (locale, v, fractionalDigits) {
                return v.toLocaleString(locale, {
                    minimumFractionDigits: fractionalDigits,
                    maximumFractionDigits: fractionalDigits
                });
            }
        },

        buildKey: function buildKey(literals) {
            var stripType = function (s) {
                return s.replace(typeInfoRegex, "");
            };
            var lastPartialKey = stripType(literals[literals.length - 1]);
            var prependPartialKey = function (memo, curr, i) {
                return "" + stripType(curr) + "{" + i + "}" + memo;
            };

            return literals.slice(0, -1).reduceRight(prependPartialKey, lastPartialKey);
        },

        extractTypeInfo: function extractTypeInfo(literal) {
            var match = typeInfoRegex.exec(literal);
            if (match) {
                return { type: match[1], options: match[3] };
            } else {
                return { type: "s", options: "" };
            }
        },

        localize: function localize(locale, value, _ref) {
            var type = _ref.type;
            var options = _ref.options;

            return translator.localizers[type](locale, value, options);
        },

        buildMessage: function buildMessage(str) {
            for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                values[_key - 1] = arguments[_key];
            }

            return str.replace(/{(\d)}/g, function (_, index) {
                return values[Number(index)];
            });
        }
    });

    return translator;
});
//# sourceMappingURL=translator.js.map