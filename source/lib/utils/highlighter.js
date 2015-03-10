define(function () {

	function highlighter(query) {
		let elm = document.querySelector(query);
		if (elm) {
			elm.className += ' utt-highlight';
		}
	}

	highlighter.find = function (selector) {
		return document.querySelectorAll(selector);
	};

	return highlighter;
});