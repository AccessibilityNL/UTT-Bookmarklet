define([],
function () {
	let evaluations = {
		create() {
			return {
				"@context": "http://www.uttbookmarklet.com/contexts/evaluation.jsonld",
    			"@type":    "evaluation",
				auditResults: []
			};
		}
	};

	return evaluations;
});