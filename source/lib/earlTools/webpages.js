define([],
function () {

	let webpages = {
		create() {
			return {
				"@context": "http://www.uttbookmarklet.com/contexts/webpage.jsonld",
			    "@type":    "webpage",
			    "title":    "Example homepage",
			    "source":   "http://example.com/"
			};
		},

		createCurrent() {
			return webpages.create();
		}
	};

	return webpages;
});