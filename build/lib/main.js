"use strict";

define(["React", "UTT/components/UttBookmarklet", "./config", "UTT/modules/home", "UTT/utils/browser-polyfill"], function (React, UttBookmarklet, config, home) {
    var UTT = undefined;

    function renderModule(comp, attr, children) {
        UTT.bookmarkNode = React.createElement(UttBookmarklet, {}, React.createElement(comp, attr, children));
        UTT.render();
    }

    function createModuleActivator(mod) {
        return function () {
            require([mod.controller], function (modController) {
                modController(mod.config, mod.locale, renderModule);
            });
        };
    }

    UTT = {
        bookmarkNode: null,
        containerNode: null,
        userKey: null,
        running: false,

        render: function render() {
            UTT.running = true;
            React.render(UTT.bookmarkNode, UTT.containerNode);
        },

        init: function init(_ref) {
            var userKey = _ref.userKey;

            var styleLink = UTT.createStyleNode();
            UTT.containerNode = UTT.createContainerNode();
            UTT.userKey = userKey;

            config.modules = config.modules.map(function (mod) {
                return Object.assign({
                    activate: createModuleActivator(mod)
                }, mod);
            });

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
            var locale = config.locale;

            UTT.bookmarkNode = React.createElement(UttBookmarklet, null, home({ modules: modules }, locale));
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