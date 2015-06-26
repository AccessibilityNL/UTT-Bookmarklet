"use strict";

define([], function () {

	var webpages = {
		protoPage: {
			"@type": "webpage",
			title: undefined,
			source: undefined
		},

		create: function create() {
			var base = arguments[0] === undefined ? {} : arguments[0];

			return Object.assign({}, webpages.protoPage, base);
		},

		createCurrent: function createCurrent() {
			var base = arguments[0] === undefined ? {} : arguments[0];

			if (window && window.document) {
				var title = document.querySelector("title").innerHTML;
				var source = window.location.href;
				base = Object.assign({ title: title, source: source }, base);
			}
			return webpages.create(base);
		}
	};

	return webpages;
});
//# sourceMappingURL=webpages.js.map