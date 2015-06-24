"use strict";

define(["React"], function (React) {

    var i18n = undefined;

    var Header = React.createClass({ displayName: "Header",
        render: function render() {
            var logoSrc = require.toUrl("UTT/components/assets/images/logo.svg");
            i18n = this.props.i18n;
            return React.createElement("div", { className: "header" }, React.createElement("h1", null, React.createElement("img", { src: logoSrc,
                width: "54", height: "54" }), i18n((function () {
                var siteObj = ["TOOL_NAME"];siteObj.raw = ["TOOL_NAME"];Object.freeze(siteObj.raw);Object.freeze(siteObj);return siteObj;
            })())), React.createElement("button", { className: "info-button", onClick: this.toggleInfo }, i18n((function () {
                var siteObj = ["tool info"];siteObj.raw = ["tool info"];Object.freeze(siteObj.raw);Object.freeze(siteObj);return siteObj;
            })())), React.createElement("p", { className: this.state.showInfo ? "show info" : "hide info" }, i18n((function () {
                var siteObj = ["TOOL_DESCR"];siteObj.raw = ["TOOL_DESCR"];Object.freeze(siteObj.raw);Object.freeze(siteObj);return siteObj;
            })())));
        },

        getInitialState: function getInitialState() {
            return { showInfo: false };
        },

        toggleInfo: function toggleInfo() {
            this.setState({
                showInfo: !this.state.showInfo
            });
        }

    });

    return Header;
});
//# sourceMappingURL=Header.js.map