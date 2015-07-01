"use strict";

define(["React", "./Panel", "UTT/utils/browser-polyfill"], function (React, Panel) {

    var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
    console.log("animation not working because CSS is not yet loaded");

    var UttBookmarklet = React.createClass({ displayName: "UttBookmarklet",
        render: function render() {
            return React.createElement(ReactCSSTransitionGroup, { transitionName: "example",
                transitionAppear: true }, React.createElement(Panel, null, this.props.children));
        }
    });
    return UttBookmarklet;
});
//# sourceMappingURL=UttBookmarklet.js.map