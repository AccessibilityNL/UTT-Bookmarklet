define([],
function () {
	let evaluations = {

		protoEval: {
		    "@type":       "evaluation",
		    "creator":     undefined,
		    // AuditResult is an array, we'll create a new one each eval
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