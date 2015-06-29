define(['React', 'UTT/components/HomePanel', 'UTT/utils/browser-polyfill'],
function (React, HomePanel) {

	return function home({modules, footerModule}, i18n) {
		return React.createElement(HomePanel, {modules, footerModule, i18n});
	};
});

