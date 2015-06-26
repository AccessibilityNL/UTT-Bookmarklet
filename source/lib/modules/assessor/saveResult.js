define(['UTT/main', 'UTT/earlTools/earlTools'],
function (UTT) {

	let earlApi     = require('UTT/earlTools/earlApi');
	let pages       = require('UTT/earlTools/webpages');
	let evaluations = require('UTT/earlTools/evaluations');
	let assertions  = require('UTT/earlTools/assertions');

	let saveResult = function (question, outcome) {
		let webpage;		// cached page
		let evaluation;		// cached eval
		let auditResult;	// cached audit results

		let logError = console.error.bind(console);
		let apiUrl   = UTT.config.apiUrl;
		let userKey  = UTT.userKey;

		earlApi.connect(apiUrl, userKey)
		.then(function (earlAdapter) {
			// Check if the page is known
			if (webpage) {
				return {earlAdapter, webpage};
			}

			// If not, create and send it to the server
			webpage = pages.createCurrent();
			return earlAdapter.post(webpage)
							  .then((webpage) => ({earlAdapter, webpage}));

		})
		.then(function ({earlAdapter, webpage}) {
			if (!evaluation) {
				evaluation  = evaluations.create();
				auditResult = evaluation.auditResult;

				let assertion = assertions.createFromQuestion({
					webpage, question, outcome
				});
				auditResult.push(assertion);

				return earlAdapter.post(evaluation);

			} else {
				let assertion = assertions.createFromQuestion({
					webpage, question, outcome
				});
				auditResult.push(assertion);
				return earlAdapter.post(assertion);
			}

		}).catch(logError);
	};

	return saveResult;

});