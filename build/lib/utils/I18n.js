"use strict";

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

define([], function () {
	// http://jaysoo.ca/2014/03/20/i18n-with-es6-template-strings/

	// Matches optional type annotations in i18n strings.
	// e.g. i18n`This is a number ${x}:n(2)` formats x as number
	//      with two fractional digits.
	var typeInfoRegex = /^:([a-z])(\((.+)\))?/;

	var locale = undefined;
	var defaultCurrency = undefined;
	var messageBundle = {};

	var localizers = {
		s /*string*/: function (v) {
			return v.toLocaleString(locale);
		},
		c /*currency*/: function (v, currency) {
			return v.toLocaleString(locale, {
				style: "currency",
				currency: currency || defaultCurrency
			});
		},
		n /*number*/: function (v, fractionalDigits) {
			return v.toLocaleString(locale, {
				minimumFractionDigits: fractionalDigits,
				maximumFractionDigits: fractionalDigits
			});
		}
	};

	function i18n(literals) {
		for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			values[_key - 1] = arguments[_key];
		}

		var translationKey = buildKey(literals);
		var translationString = messageBundle[translationKey] || translationKey;
		var typeInfoForValues = literals.slice(1).map(extractTypeInfo);
		var localizedValues = values.map(function (v, i) {
			return localize(v, typeInfoForValues[i]);
		});
		return buildMessage.apply(undefined, [translationString].concat(_toConsumableArray(localizedValues)));
	}

	i18n.setLocale = function (_locale, _defaultCurrency, _messageBundle) {
		locale = _locale;
		defaultCurrency = _defaultCurrency;
		messageBundle = _messageBundle;
	};

	// e.g. I18n._buildKey(['', ' has ', ':c in the']) == '{0} has {1} in the bank'
	function buildKey(literals) {
		var stripType = function (s) {
			return s.replace(typeInfoRegex, "");
		};
		var lastPartialKey = stripType(literals[literals.length - 1]);
		var prependPartialKey = function (memo, curr, i) {
			return "" + stripType(curr) + "{" + i + "}" + memo;
		};

		return literals.slice(0, -1).reduceRight(prependPartialKey, lastPartialKey);
	}

	function extractTypeInfo(literal) {
		var match = typeInfoRegex.exec(literal);
		if (match) {
			return { type: match[1], options: match[3] };
		} else {
			return { type: "s", options: "" };
		}
	}

	function localize(value, _ref) {
		var type = _ref.type;
		var options = _ref.options;

		return localizers[type](value, options);
	}

	// e.g. I18n._formatStrings('{0} {1}!', 'hello', 'world') == 'hello world!'
	function buildMessage(str) {
		for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			values[_key - 1] = arguments[_key];
		}

		return str.replace(/{(\d)}/g, function (_, index) {
			return values[Number(index)];
		});
	}

	return i18n;
});
//# sourceMappingURL=I18n.js.map