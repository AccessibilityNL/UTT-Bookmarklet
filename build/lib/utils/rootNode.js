"use strict";

define([], function () {
    var container = undefined;
    var rootNodeId = "utt-bookmarklet-container";
    var styleNodeId = "utt-bookmarklet-stylesheet";

    var rootNode = {
        getContainer: function getContainer() {
            container = document.getElementById(rootNodeId);
            if (!container) {
                container = document.createElement("div");
                container.id = rootNodeId;
            }

            document.head.appendChild(rootNode.getStyleNode());
            document.body.appendChild(container);
            return container;
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
        } };

    return rootNode;
});
//# sourceMappingURL=rootNode.js.map