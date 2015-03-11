"use strict";

define(["React", "UTT/components/UttBookmarklet"], function (React, UttBookmarklet) {

    var UTT = {
        bookmarkNode: null,
        containerNode: null,
        userKey: null,

        modulesLoaded: function modulesLoaded() {
            for (var _len = arguments.length, modules = Array(_len), _key = 0; _key < _len; _key++) {
                modules[_key] = arguments[_key];
            }

            var options = {
                userKey: UTT.userKey,
                url: require.toUrl(".")
            };
            modules.forEach(function (module) {
                return module.init(options);
            });
            UTT.bookmarkNode.props.modules = modules;
            React.render(UTT.bookmarkNode, UTT.containerNode);
        },

        init: function init(_ref) {
            var modules = _ref.modules;
            var userKey = _ref.userKey;

            var styleLink = UTT.createStyleNode();
            UTT.containerNode = UTT.createContainerNode();
            UTT.userKey = userKey;

            // Prefix module names
            modules = modules.map(function (modName) {
                return "UTT/modules/" + modName + "/" + modName;
            });

            require(modules, UTT.modulesLoaded);

            document.head.appendChild(styleLink);
            document.body.appendChild(UTT.containerNode);

            UTT.bookmarkNode = React.createElement(UttBookmarklet, { modules: [] });
            React.render(UTT.bookmarkNode, UTT.containerNode);
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