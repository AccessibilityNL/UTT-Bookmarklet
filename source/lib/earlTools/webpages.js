define([],
function () {

	let webpages = {
		protoPage: {
		    "@type":    "webpage",
		    "title":    undefined,
		    "source":   undefined
		},

		create(base = {}) {
			return Object.assign({}, webpages.protoPage, base);
		},

		createCurrent(base = {}) {
			if (window && window.document) {
				let title  = document.querySelector('title').innerHTML;
				let source = window.location.href;
				base       = Object.assign({title, source}, base);
			}
			return webpages.create(base);
		}
	};

	return webpages;
});