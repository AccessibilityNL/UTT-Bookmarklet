define(['UTT/main', 'UTT/earlTools/earlTools'],
function (UTT) {

	let earlApi     = require('UTT/earlTools/earlApi');
	let pages       = require('UTT/earlTools/webpages');
	let evaluations = require('UTT/earlTools/evaluations');
	let assertions  = require('UTT/earlTools/assertions');

	let evaluation;
	let webpage;
	let auditResult;

	let logError = console.error.bind(console);

	let saveResult = function (question, outcome) {

		let apiUrl  = UTT.config.apiUrl;
		let userKey = UTT.userKey;

		earlApi.connect(apiUrl, userKey)
		.then(function (earlAdapter) {
			if (!evaluation) {
				webpage     = pages.createCurrent();
				evaluation  = evaluations.create();
				auditResult = evaluation.auditResult;

				console.log(evaluation);

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