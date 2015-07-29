"use strict";

define(["React", "UTT/components/HomePanel", "UTT/utils/browser-polyfill"], function (React, HomePanel) {

	return function home(_ref, i18n, render) {
		var modules = _ref.modules;
		var footerModule = _ref.footerModule;

		render(HomePanel, { modules: modules, footerModule: footerModule, i18n: i18n });
	};
});
//# sourceMappingURL=home.js.map