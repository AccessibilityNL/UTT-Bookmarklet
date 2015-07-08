define(['React', 'UTT/components/HomePanel', 'UTT/utils/browser-polyfill'],
function (React, HomePanel) {

	return function home({modules, footerModule}, i18n, render) {
		render(HomePanel, {modules, footerModule, i18n});
	};
});

