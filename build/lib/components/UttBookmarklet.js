"use strict";

define(["React", "./Panel", "UTT/utils/browser-polyfill"], function (React, Panel) {
    var UttBookmarklet = React.createClass({ displayName: "UttBookmarklet",
        render: function render() {
            return React.createElement(Panel, null, this.props.children);
        }
    });
    return UttBookmarklet;
});
//# sourceMappingURL=UttBookmarklet.js.map