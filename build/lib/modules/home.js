"use strict";

define(["React", "UTT/components/HomePanel"], function (React, HomePanel) {

	return function home(_ref, locale) {
		var modules = _ref.modules;

		console.log("start home");
		return React.createElement(HomePanel, { modules: modules, locale: locale });
	};
});
//# sourceMappingURL=home.js.map