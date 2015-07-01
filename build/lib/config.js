"use strict";

define(["UTT/locale/common", "UTT/locale/assessor/common", "UTT/locale/assessor/images", "UTT/locale/assessor/media", "UTT/locale/assessor/language", "UTT/locale/assessor/navigation", "UTT/locale/assessor/keyboard", "UTT/locale/reporter", "UTT/utils/browser-polyfill"], function () {
    var localeAssessor = require("UTT/locale/assessor/common");

    var assessorNames = ["images", "media", "language", "navigation", "keyboard"];

    var config = {
        apiUrl: "http://utt-dev.huell.appnormal.com/v1",
        modules: assessorNames.map(function (assessorName) {
            return {
                controller: "UTT/modules/assessor",
                config: {
                    icon: "icon-" + assessorName + ".svg",
                    iconIncomplete: "icon-" + assessorName + "-report-0.svg",
                    iconComplete: "icon-" + assessorName + "-report-1.svg",
                    questions: "UTT/modules/assessor/questions",
                    category: assessorName
                },
                locale: Object.assign(require("UTT/locale/assessor/" + assessorName), localeAssessor)
            };
        }),
        footerModule: {
            controller: "UTT/modules/reporter/reporter",
            config: {},
            locale: require("UTT/locale/reporter")
        },
        locale: require("UTT/locale/common")
    };

    return config;
});
//# sourceMappingURL=config.js.map