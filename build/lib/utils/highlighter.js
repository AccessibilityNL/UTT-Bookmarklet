"use strict";

define(function () {

	function highlighter(elm) {
		if (typeof elm === "string") {
			elm = document.querySelector(elm);
		}
		if (elm) {
			elm.className += " utt-highlight";
		}
	}

	highlighter.find = function (selector) {
		return document.querySelectorAll(selector);
	};

	highlighter.removeHighlight = function () {
		Array.from(document.querySelectorAll(".utt-highlight")).forEach(function (elm) {
			elm.className = elm.className.replace(/utt-highlight/, "").trim();
		});
	};

	return highlighter;
});
//# sourceMappingURL=highlighter.js.map