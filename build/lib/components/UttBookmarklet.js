"use strict";

define(["React", "./Panel", "./Header", "UTT/utils/rootNode", "UTT/utils/browser-polyfill"], function (React, Panel, Header) {

    var UttBookmarklet = React.createClass({ displayName: "UttBookmarklet",
        render: function render() {
            return React.createElement(Panel, { dragable: true }, React.createElement(Header, { i18n: this.props.i18n }), this.props.children);
        }

    });
    return UttBookmarklet;
});
//# sourceMappingURL=UttBookmarklet.js.map