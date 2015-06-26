/**
 * This is a simple wrapper, it loads all in earlTools and puts them in
 * 1 object
 */
"use strict";

(function () {

	var modules = ["webpages", "assertions", "evaluations", "earlPointers", "earlApi"];

	define(modules.map(function (module) {
		return "./" + module;
	}), function () {

		var earlTools = modules.reduce(function (obj, module) {
			obj[module] = require("UTT/earlTools/" + module);
			return obj;
		}, {});
		return earlTools;
	});
})();
//# sourceMappingURL=earlTools.js.map