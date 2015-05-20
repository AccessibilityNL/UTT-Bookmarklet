define(['React', 'UTT/components/HomePanel'],
function (React, HomePanel) {

	return function home({modules}, locale) {
		console.log('start home');
		return React.createElement(HomePanel, {modules, locale});
	};
});

