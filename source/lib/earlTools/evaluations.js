define([],
function () {
	let evaluations = {

		protoEval: {
		    "@type":       "evaluation"
		    // "creator":     undefined,
		    // "auditResult": []
		},

		create(base = {}) {
			return Object.assign({
				auditResult: []
			}, evaluations.protoEval, base);
		}

	};

	return evaluations;
});