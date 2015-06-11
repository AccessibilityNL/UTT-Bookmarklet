define([], function () {
	// http://jaysoo.ca/2014/03/20/i18n-with-es6-template-strings/

	// Matches optional type annotations in i18n strings.
	// e.g. i18n`This is a number ${x}:n(2)` formats x as number
	//      with two fractional digits.
	const typeInfoRegex = /^:([a-z])(\((.+)\))?/;

	let locale;
	let defaultCurrency;
	let messageBundle = {};

	let localizers = {
	    s /*string*/: v => v.toLocaleString(locale),
	    c /*currency*/: (v, currency) => (
	      v.toLocaleString(locale, {
	        style: 'currency',
	        currency: currency || defaultCurrency
	      })
	    ),
	    n /*number*/: (v, fractionalDigits) => (
	      v.toLocaleString(locale, {
	        minimumFractionDigits: fractionalDigits,
	        maximumFractionDigits: fractionalDigits
	      })
	    )
  	};

	function i18n(literals, ...values) {
		let translationKey = buildKey(literals);
	    let translationString = messageBundle[translationKey] || translationKey;
	    let typeInfoForValues = literals.slice(1).map(extractTypeInfo);
	    let localizedValues   = values.map((v, i) => localize(v, typeInfoForValues[i]));
	    return buildMessage(translationString, ...localizedValues);
	}

	i18n.setLocale = function (_locale, _defaultCurrency, _messageBundle) {
		locale = _locale;
    	defaultCurrency = _defaultCurrency;
    	messageBundle = _messageBundle;
	};


	// e.g. I18n._buildKey(['', ' has ', ':c in the']) == '{0} has {1} in the bank'
	function buildKey(literals) {
	    let stripType = s => s.replace(typeInfoRegex, '');
	    let lastPartialKey = stripType(literals[literals.length - 1]);
	    let prependPartialKey = (memo, curr, i) => `${stripType(curr)}{${i}}${memo}`;

	    return literals.slice(0, -1).reduceRight(prependPartialKey, lastPartialKey);
  	}


  	function extractTypeInfo(literal) {
	    let match = typeInfoRegex.exec(literal);
	    if (match) {
	      return {type: match[1], options: match[3]};
	    } else {
	      return {type: 's', options: ''};
	    }
  	}


	function localize(value, {type, options}) {
		return localizers[type](value, options);
	}


  	// e.g. I18n._formatStrings('{0} {1}!', 'hello', 'world') == 'hello world!'
  	function buildMessage(str, ...values) {
    	return str.replace(/{(\d)}/g, (_, index) => values[Number(index)]);
  	}

	return i18n;
});