"use strict";

define([], function () {
	var evaluations = {

		protoEval: {
			"@type": "evaluation"
			// "creator":     undefined,
			// "auditResult": []
		},

		create: function create() {
			var base = arguments[0] === undefined ? {} : arguments[0];

			return Object.assign({
				auditResult: []
			}, evaluations.protoEval, base);
		}

	};

	return evaluations;
});
//# sourceMappingURL=evaluations.js.map