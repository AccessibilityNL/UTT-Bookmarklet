"use strict";

define(["React", "./Header", "./ModuleList"], function (React, Header, ModuleList) {

    var i18n = undefined;

    var HomePanel = React.createClass({ displayName: "HomePanel",
        render: function render() {
            i18n = this.props.i18n;
            return React.createElement("div", { className: "home" }, React.createElement(Header, { i18n: i18n }), React.createElement(ModuleList, { modules: this.props.modules, i18n: i18n }), this.renderResultLink());
        },

        renderResultLink: function renderResultLink() {
            return React.createElement("div", { className: "results-overview" }, React.createElement("ul", null, React.createElement("li", null, React.createElement("img", { src: "", alt: "TODO", width: "24", height: "24" })), React.createElement("li", null, React.createElement("img", { src: "", alt: "TODO", width: "24", height: "24" })), React.createElement("li", null, React.createElement("img", { src: "", alt: "TODO", width: "24", height: "24" })), React.createElement("li", null, React.createElement("img", { src: "", alt: "TODO", width: "24", height: "24" })), React.createElement("li", null, React.createElement("img", { src: "", alt: "TODO", width: "24", height: "24" }))), React.createElement("button", null, i18n((function () {
                var siteObj = ["results"];siteObj.raw = ["results"];Object.freeze(siteObj.raw);Object.freeze(siteObj);return siteObj;
            })())));
        }

    });
    return HomePanel;
});
//# sourceMappingURL=HomePanel.js.map