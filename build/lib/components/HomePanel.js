"use strict";

define(["React", "./Header", "./ModuleList"], function (React, Header, ModuleList) {
    var HomePanel = React.createClass({ displayName: "HomePanel",

        render: function render() {
            return React.createElement("div", { className: "home" }, React.createElement(Header, null), React.createElement(ModuleList, { modules: this.props.modules }), this.renderResultLink());
        },

        renderResultLink: function renderResultLink() {
            return React.createElement("div", { className: "results-overview" }, React.createElement("ul", null, React.createElement("li", null, React.createElement("img", { src: "", alt: "TODO", width: "24", height: "24" })), React.createElement("li", null, React.createElement("img", { src: "", alt: "TODO", width: "24", height: "24" })), React.createElement("li", null, React.createElement("img", { src: "", alt: "TODO", width: "24", height: "24" })), React.createElement("li", null, React.createElement("img", { src: "", alt: "TODO", width: "24", height: "24" })), React.createElement("li", null, React.createElement("img", { src: "", alt: "TODO", width: "24", height: "24" }))), React.createElement("button", null, "Results"));
        }

    });
    return HomePanel;
});
//# sourceMappingURL=HomePanel.js.map