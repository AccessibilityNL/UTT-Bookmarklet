define(function () {
    let translator;

    // Matches optional type annotations in i18n strings.
    // e.g. i18n`This is a number ${x}:n(2)` formats x as number
    //      with two fractional digits.
    const typeInfoRegex = /^:([a-z])(\((.+)\))?/;

    translator = function ({locale, defaultCurrency, messageBundle}) {

        return function (literals, ...values) {
            if (!Array.isArray(literals)) {
                literals = [literals];
            }
            let translationKey = translator.buildKey(literals);
            let translationString = messageBundle[translationKey];

            if (translationString) {
                let typeInfoForValues = literals.slice(1).map(translator.extractTypeInfo);
                let localizedValues = values.map((v, i) => translator.localize(locale, v, typeInfoForValues[i]));
                return translator.buildMessage(translationString, ...localizedValues);
            }

            if (translator.logging) {
                console.warn(`Translation missing '${translationKey}'`);
            }

            return translationKey;
        };
    };

    Object.assign(translator, {
        defaultCurrency: 'EURO',
        logging: true,
        localizers: {
            /*string*/
            s: (locale, v) => (
                v.toLocaleString(locale)
            ),

            /*currency*/
            c: (locale, v, currency) => (
                v.toLocaleString(locale, {
                    style: 'currency',
                    currency: currency || translator.defaultCurrency
                })
            ),

            /*number*/
            n: (locale, v, fractionalDigits) => (
                v.toLocaleString(locale, {
                    minimumFractionDigits: fractionalDigits,
                    maximumFractionDigits: fractionalDigits
                })
            )
        },

        buildKey(literals) {
            let stripType = s => s.replace(typeInfoRegex, '');
            let lastPartialKey = stripType(literals[literals.length - 1]);
            let prependPartialKey = (memo, curr, i) => `${stripType(curr)}{${i}}${memo}`;

            return literals.slice(0, -1).reduceRight(prependPartialKey, lastPartialKey);
        },

        extractTypeInfo(literal) {
            let match = typeInfoRegex.exec(literal);
            if (match) {
                return {type: match[1], options: match[3]};
            } else {
                return {type: 's', options: ''};
            }
        },

        localize(locale, value, {type, options}) {
            return translator.localizers[type](locale, value, options);
        },

        buildMessage(str, ...values) {
            return str.replace(/{(\d)}/g, (_, index) => values[Number(index)]);
        }
    });

    return translator;

});

