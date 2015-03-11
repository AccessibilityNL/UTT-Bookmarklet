"use strict";

define(function () {

	function highlighter(query) {
		var elm = document.querySelector(query);
		if (elm) {
			elm.className += " utt-highlight";
		}
	}

	highlighter.find = function (selector) {
		return document.querySelectorAll(selector);
	};

	return highlighter;
});
//# sourceMappingURL=highlighter.js.map