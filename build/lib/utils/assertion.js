"use strict";

define(function () {

	var assertion = {
		create: function create(_ref) {
			var element = _ref.element;
			var subject = _ref.subject;
			var testcase = _ref.testcase;
			var userKey = _ref.userKey;
			var mode = _ref.mode;
			var outcome = _ref.outcome;
			var url = _ref.url;

			return {
				subject: subject || null,
				mode: mode || "manual",
				testcase: testcase || null,
				result: {
					outcome: outcome || "untested",
					pointer: assertion.createPointer(element)
				},
				assertedBy: assertion.createAssertorFromKey(userKey, url)
			};
		},
		createPointer: function createPointer(domNode) {
			return {
				charSnippet: domNode.outerHTML.substr(0, 255)
			};
		},
		createAssertorFromKey: function createAssertorFromKey(userKey, url) {
			return url + "assertors/" + userKey;
		}
	};

	return assertion;
});
//# sourceMappingURL=assertion.js.map