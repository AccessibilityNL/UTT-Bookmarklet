define(['UTT/components/Reporter'],
function (Reporter) {

	let results = [];

	let reporter = function(config, i18n, render) {
		render(Reporter, {
			results,
			i18n: i18n
		});
	};

	reporter.addResult = function (categoryName, result) {
		let category = results.find((elm) => elm.name === categoryName);
		if (!category) {
			category = {
				name: categoryName,
				results: []
			};
			results.push(category);
		}

		category.results.push(result);
		console.log(results);
	};

	return reporter;

});