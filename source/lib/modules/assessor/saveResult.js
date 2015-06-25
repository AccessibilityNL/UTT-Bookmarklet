define(['UTT/earlTools/earlTools'],
function () {

	let earlApi     = require('UTT/earlTools/earlApi');
	let pages       = require('UTT/earlTools/webpages');
	let evaluations = require('UTT/earlTools/evaluations');
	let assertions  = require('UTT/earlTools/assertions');

	let evaluation;
	let webpage;
	let auditResults;

	let logError = console.error.bind(console);

	let saveResult = function (question, result) {

		let apiUrl     = 'http://utt-dev.huell.appnormal.com/v1';
		let privateKey = 'mYpr1V4t3k3Y';

		earlApi.connect(apiUrl, privateKey)
		.then(function (earlAdapter) {
			if (!evaluation) {
				webpage      = pages.createCurrent();
				evaluation   = evaluations.create({webpage});
				auditResults = evaluation.auditResults;

				let assertion = assertions.createFromQuestion({
					webpage, question, result
				});
				auditResults.push(assertion);

				return earlAdapter.post(evaluation);

			} else {
				let assertion = assertions.createFromQuestion({
					webpage, question, result
				});
				auditResults.push(assertion);
				return earlAdapter.post(assertion);
			}

		}).catch(logError);
	};

	return saveResult;

});