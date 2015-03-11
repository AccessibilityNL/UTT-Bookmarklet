define(function () {

	let assertion = {
		create({element, subject, testcase, userKey, mode, outcome, url}) {
			return {
				subject:  (subject  || null),
				mode: 	  (mode     || 'manual'),
                testcase: (testcase || null),
                result: {
                	outcome: (outcome || 'untested'),
                	pointer: assertion.createPointer(element)
                },
                assertedBy: assertion.createAssertorFromKey(userKey, url)
			};
		},
		createPointer(domNode) {
			return {
				charSnippet: domNode.outerHTML.substr(0, 255)
			};
		},
		createAssertorFromKey(userKey, url) {
			return url + 'assertors/' + userKey;
		}
	};


	return assertion;
});