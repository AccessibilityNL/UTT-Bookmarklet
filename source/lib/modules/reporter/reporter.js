define(['UTT/components/Reporter'],
function (Reporter) {

	let categories = [];

	let reporter = function(config, i18n, render) {
		render(Reporter, {
			categories,
			i18n: i18n
		});
	};

	reporter.addResult = function (categoryBase, result) {
		let category = categories.find((elm) => elm.title === categoryBase.title);
		if (!category) {
			category = Object.assign({results: []}, categoryBase);
			categories.push(category);
		}
		category.results.push(result);
	};

	return reporter;

});