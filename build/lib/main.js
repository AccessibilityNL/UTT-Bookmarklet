"use strict";

define(["React", "UTT/components/UttBookmarklet", "./config", "UTT/modules/home", "UTT/utils/translator", "UTT/utils/browser-polyfill"], function (React, UttBookmarklet, config, home, translator) {
    var UTT = undefined;

    config.i18n = translator({ messageBundle: config.locale });

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
            React.render(UTT.bookmarkNode, UTT.containerNode);
        },

        init: function init(_ref) {
            var userKey = _ref.userKey;

            var styleLink = UTT.createStyleNode();
            UTT.containerNode = UTT.createContainerNode();
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

            document.head.appendChild(styleLink);
            document.body.appendChild(UTT.containerNode);

            this.showHome();
        },

        start: function start() {
            UTT.render();
        },

        stop: function stop() {
            UTT.running = false;
            React.unmountComponentAtNode(UTT.containerNode);
        },

        showHome: function showHome() {
            var modules = config.modules;
            var footerModule = config.footerModule;
            var i18n = config.i18n;

            UTT.bookmarkNode = React.createElement(UttBookmarklet, null, home({ modules: modules, footerModule: footerModule }, i18n));

            React.render(UTT.bookmarkNode, UTT.containerNode);
        },

        toggle: function toggle() {
            UTT[UTT.running ? "stop" : "start"]();
        },

        createStyleNode: function createStyleNode() {
            var id = "utt-bookmarklet-stylesheet";
            var link = document.getElementById(id);
            if (!link) {
                link = document.createElement("link");
                link.id = id;
                link.setAttribute("rel", "stylesheet");
                link.setAttribute("href", require.toUrl("UTT/components/assets/styles/main.css"));
            }
            return link;
        },

        createContainerNode: function createContainerNode() {
            var id = "utt-bookmarklet-container";
            var containerNode = document.getElementById(id);
            if (!containerNode) {
                containerNode = document.createElement("div");
                containerNode.id = id;
            }
            return containerNode;
        }
    };

    return UTT;
});
//# sourceMappingURL=main.js.map