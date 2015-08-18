define(function () {

	function highlighter(element) {
		if (typeof element === 'string') {
			element = document.querySelector(elm);
		}
		if (element) {
			element.className += 'utt-highlight ';
			// check if element has a positioning and if not, make it a position: relative;
			if(element.style.position == ""){
				element.style.position = 'relative';
			}
			// based on element dimensions place pointer 
			var rect = element.getBoundingClientRect();
			var elementLeft, elementTop;
			var scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop:document.body.scrollTop;
			var scrollLeft = document.documentElement.scrollLeft ? document.documentElement.scrollLeft:document.body.scrollLeft;
			var elementWidth = element.offsetWidth;
			elementTop = rect.top + scrollTop - 54;
			elementLeft = rect.left + scrollLeft + (elementWidth/2);
			// 'prepend' marker element to selected element
		    element.insertAdjacentHTML('beforebegin', '<span class="utt-marker" style="top:' + elementTop + 'px !important; left: ' + elementLeft + 'px !important"></span>');
		    // TODO this needs a finetuning update, but at least it works now.
		    element.scrollIntoView(false);
		}
	}
	highlighter.find = function (selector) {
		return document.querySelectorAll(selector);
	};

	highlighter.removeHighlight = function () {
		Array.from(document.querySelectorAll('.utt-highlight'))
		.forEach((element) => {
			element.className = element.className.replace(/utt-highlight/,'').trim();
		});
		Array.from(document.querySelectorAll('.utt-marker'))
		.forEach((element) => {
			element.className = element.className.replace(/utt-marker/,'').trim();
		});

	};
	return highlighter;
});