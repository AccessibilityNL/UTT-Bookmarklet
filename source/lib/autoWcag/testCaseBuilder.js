define(function () {

	let builder = {
		createSelector(selectConf) {
			console.log(selectConf);
			if (typeof selectConf === 'function') {
				return selectConf;

			} else if (typeof selectConf !== 'object') {
				throw new Error('Unknown selector');

			} else if (selectConf.type === 'css') {
				return builder.createCssSelector(selectConf.value);
			}
		},

		createCssSelector(cssSelector) {
			return (elm) => Array.from(elm.querySelectorAll(cssSelector));
		},

		createTestStep() {

		}
	};

	return builder;
});