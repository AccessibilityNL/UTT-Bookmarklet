define(function () {

	let builder = {
		createSelectorFunc(selectConf) {
			if (typeof selectConf === 'function') {
				return selectConf;

			} else if (typeof selectConf !== 'object') {
				throw 'Unknown selector';

			} else if (selectConf.type === 'css') {
				return builder.createCssSelector(selectConf.value);
			}
		},

		createStepFunc(stepConfig) {
			let buildFunc = builder.testStepFunctions[stepConfig.type];
			if (!buildFunc) {
				throw 'Unknown step type ' + stepConfig.type;
			}
			return buildFunc.bind(null, stepConfig);
		},

		/**
		 * Collection of test step functions
		 * @type {Object}
		 */
		testStepFunctions: {
			/**
			 * Fully automatic test step
			 * @param  {[type]} stepConfig [description]
			 * @param  {[type]} element    [description]
			 * @return {[type]}            [description]
			 */
			automatic(stepConfig, element) {
				let resolve, reject;
				let p = new Promise((res, rej) => {
					resolve = res; reject = rej;
				});
				let vars = {
					element
				};

				resolve(stepConfig.method(vars));
				return p;
			},

			/**
			 * Test step based on user question
			 * @param  {[type]} stepConfig [description]
			 * @param  {[type]} element    [description]
			 * @return {[type]}            [description]
			 */
			userQuestion(stepConfig, element, promptUser) {
				return promptUser(stepConfig.question);
			}
		},

		createCssSelector(cssSelector) {
			return (elm) => Array.from(elm.querySelectorAll(cssSelector));
		},

	};

	return builder;
});