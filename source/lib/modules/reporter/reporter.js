define(['UTT/components/Reporter'],
function (Reporter) {

	let reporter = function(config, i18n, render) {

		render(Reporter, {
			i18n: i18n,
		});
	};

	return reporter;

});