define([],
function () {
	let assertions = {
		create() {
			return {
				"@context": "http://www.uttbookmarklet.com/contexts/assertion.jsonld",
			    "@type":    "Assertion",
			    "subject":  "utt:webpages/::id::",
			    "mode": 	"earl:semiAuto",
			    "test": {
			        // "@id":     "wcag20:text-equiv-all",
			        "@type":   "TestRequirement"
			    },
			    "result": {
			        "@type": "TestResult",
			        // "outcome": "earl:failed"
			    }
			};
		},

		createFromQuestion() {
			return assertions.create();
		}
	};

	return assertions;
});