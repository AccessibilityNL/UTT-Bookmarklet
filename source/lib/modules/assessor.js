define(['React', 'UTT/components/Assessor'],
function (React, Assessor) {

	return function assertor(config, locale) {
		console.log(config);
		return React.createElement(Assessor, null);
	};
});

