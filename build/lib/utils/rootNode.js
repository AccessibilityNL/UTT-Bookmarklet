"use strict";

define([], function () {
    var container = undefined;
    var rootNodeId = "utt-bookmarklet-container";
    var styleNodeId = "utt-bookmarklet-stylesheet";

    var rootNode = {

        getContainer: function getContainer() {
            container = document.getElementById(rootNodeId);
            if (!container) {
                container = rootNode.createContainer();
            }

            document.head.appendChild(rootNode.getStyleNode());
            document.body.appendChild(container);
            return container;
        },

        show: function show() {
            window.setTimeout(function () {
                return container.className += "display";
            }, 100);
        },

        hide: function hide() {
            window.setTimeout(function () {
                container.className = container.className.replace(/display/i, "").trim();
            }, 100);
        },

        createContainer: function createContainer() {
            var node = document.createElement("div");
            node.id = rootNodeId;
            rootNode.addStyle();
            rootNode.show();
            return node;
        },

        getStyleNode: function getStyleNode() {
            var link = document.getElementById(styleNodeId);
            if (!link) {
                link = document.createElement("link");
                link.id = styleNodeId;
                link.setAttribute("rel", "stylesheet");
                link.setAttribute("href", require.toUrl("UTT/components/assets/styles/main.css"));
            }
            return link;
        },

        addStyle: function addStyle() {
            var style = document.createElement("style");
            style.innerHTML = "\n            #" + rootNodeId + " {\n                position: fixed;\n                top: 10px;\n                right: 5%;\n                width: 310px;\n                padding: 5px;\n                box-shadow: 0 0 15px RGBA(0, 0, 0, 0.6);\n                background: white;\n                z-index: 99999999;\n                overflow:hidden;\n                transition: opacity .5s,\n                            height .2s,\n                            top .5s;\n                opacity: 0;\n                height: 0px;\n                top:0;\n            }\n            #" + rootNodeId + ".display {\n                opacity:0.95;\n                height: 440px;\n                top: 10px;\n            }";
            document.head.appendChild(style);
        }
    };

    return rootNode;
});
//# sourceMappingURL=rootNode.js.map