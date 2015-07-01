"use strict";

define(["React", "UTT/main"], function (React) {

    var i18n = undefined;

    var Header = React.createClass({ displayName: "Header",
        render: function render() {
            var logoSrc = require.toUrl("UTT/components/assets/images/logo.svg");
            var closeBtnSrc = require.toUrl("UTT/components/assets/images/close.svg");
            var UTT = require("UTT/main");

            i18n = this.props.i18n;
            return React.createElement("div", null, React.createElement("div", { className: "header" }, React.createElement("h1", null, React.createElement("img", { src: logoSrc,
                width: "54", height: "54" }), React.createElement("span", { className: "app-name" }, i18n((function () {
                var siteObj = ["TOOL_NAME"];siteObj.raw = ["TOOL_NAME"];Object.freeze(siteObj.raw);Object.freeze(siteObj);return siteObj;
            })())), React.createElement("span", { className: "app-byline" }, i18n((function () {
                var siteObj = ["TOOL_BYLINE"];siteObj.raw = ["TOOL_BYLINE"];Object.freeze(siteObj.raw);Object.freeze(siteObj);return siteObj;
            })()))), React.createElement("button", { className: "info-button", onClick: this.toggleInfo }, i18n((function () {
                var siteObj = ["tool info"];siteObj.raw = ["tool info"];Object.freeze(siteObj.raw);Object.freeze(siteObj);return siteObj;
            })())), React.createElement("input", { className: "close-button", onClick: UTT.stop,
                src: closeBtnSrc, alt: i18n((function () {
                    var siteObj = ["close"];siteObj.raw = ["close"];Object.freeze(siteObj.raw);Object.freeze(siteObj);return siteObj;
                })()),
                type: "image", width: "30", height: "30" })), React.createElement("p", { className: this.state.showInfo ? "show info" : "hide info" }, i18n((function () {
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