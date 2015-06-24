"use strict";

define(["UTT/locale/common", "UTT/locale/assessor/common", "UTT/locale/assessor/images", "UTT/locale/assessor/media", "UTT/locale/assessor/language", "UTT/locale/assessor/navigation", "UTT/locale/assessor/keyboard", "UTT/utils/browser-polyfill"], function () {
    var localeAssessor = require("UTT/locale/assessor/common");

    var assessorNames = ["images", "media", "language", "navigation", "keyboard"];

    var config = {
        modules: assessorNames.map(function (assessorName) {
            return {
                controller: "UTT/modules/assessor",
                config: {
                    icon: "icon-" + assessorName + ".svg",
                    questions: "UTT/modules/assessor/questions",
                    category: assessorName
                },
                locale: Object.assign(require("UTT/locale/assessor/" + assessorName), localeAssessor)
            };
        }),
        locale: require("UTT/locale/common")
    };

    return config;
});
//# sourceMappingURL=config.js.map