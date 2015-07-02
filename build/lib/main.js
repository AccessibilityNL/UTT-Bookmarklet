"use strict";

define(["React", "UTT/components/UttBookmarklet", "./config", "UTT/modules/home", "UTT/utils/translator", "UTT/utils/rootNode", "UTT/utils/browser-polyfill"], function (React, UttBookmarklet, config, home, translator) {
    var UTT = undefined;

    config.i18n = translator({ messageBundle: config.locale });
    var rootNode = require("UTT/utils/rootNode");

    function renderModule(comp, attr, children) {
        UTT.bookmarkNode = React.createElement(UttBookmarklet, {}, React.createElement(comp, attr, children));
        UTT.render();
    }

    function createModuleActivator(mod) {
        return function () {
            require([mod.controller], function (modController) {
                var i18n = translator({
                    messageBundle: Object.assign(mod.locale, config.locale)
                });
                modController(mod.config, i18n, renderModule);
            });
        };
    }

    UTT = {
        bookmarkNode: null,
        containerNode: null,
        running: false,
        config: null,
        userKey: null,
        render: function render() {
            UTT.running = true;

            React.render(UTT.bookmarkNode, rootNode.getContainer());
        },

        init: function init(_ref) {
            var userKey = _ref.userKey;

            rootNode.getContainer();

            config.modules = config.modules.map(function (mod) {
                return Object.assign({
                    activate: createModuleActivator(mod)
                }, mod);
            });

            if (config.footerModule) {
                var mod = config.footerModule;
                config.footerModule = Object.assign({
                    activate: createModuleActivator(mod)
                }, mod);
            }

            UTT.userKey = userKey;
            Object.freeze(config);
            UTT.config = config;
            this.showHome();
        },

        start: function start() {
            UTT.render();
        },

        stop: function stop() {
            UTT.running = false;
            React.unmountComponentAtNode(rootNode.getContainer());
        },

        showHome: function showHome() {
            var modules = config.modules;
            var footerModule = config.footerModule;
            var i18n = config.i18n;

            UTT.bookmarkNode = React.createElement(UttBookmarklet, null, home({ modules: modules, footerModule: footerModule }, i18n));

            React.render(UTT.bookmarkNode, rootNode.getContainer());
        },

        toggle: function toggle() {
            UTT[UTT.running ? "stop" : "start"]();
        } };

    return UTT;
});
//# sourceMappingURL=main.js.map