define(['./createCssPointer', 'qwest'],
function (cssPointer, qwest) {
	console.log(qwest);

	// Should not be hardcoded!
	let contextRoot = 'http://utt-dev.huell.appnormal.com/v1';

	let privateKey  = 'abcdefghijklmnop';

	let connected   = true;


	// do stuff with promises
	const earlStore = Object.seal({

		setContextRoot(rootDomain) {
			contextRoot = rootDomain;
		},

		buildAssertion(question, result) {
			return {};
			// return {
			//     "@context":   contextRoot + "/assertions/context.jsonld",
			//     "@type":      "Assertion",
			//     "@id":        "utt:asssertions/1234567890",
			//     "subject":    "utt:evaluations/123456/scope",
			//     "assertedBy": "utt:assertors/123456",
			//     "test": {
			//         "@type": "TestRequirement",
			//         "@id":   "wcag20:text-equiv-all"
			//     },
			//     "result": {
			//         "@type":  "TestResult",
			//         "outcome": "failed"
			//     },
			//     "date": "2014-01-01T19:20:30+01:00",
			// };
		},

		addAssertion() {
			let evaluation = earlStore.getEvaluation();
			//evaluation.addStuff = true;
		},

		getAssertions() {

		},

		getEvaluation() {
			earlStore.connect();
		},

		connect() {
			// if (connected) {
			// 	return;
			// }
			console.log('get', contextRoot + '/assertors');
			qwest.get(contextRoot + '/assertors', {
	        	"q": privateKey

	     	}).then(function(response) {
	     		console.log('then:', response);

		     }).catch(function(e, response) {
		     	console.log('catch:', e, response);

		     });
		}

	});

	return earlStore;

});