"use strict";

define(["React"], function (React) {
    var Header = React.createClass({ displayName: "Header",

        render: function render() {
            return React.createElement("div", { className: "header" }, React.createElement("h1", null, React.createElement("img", { src: "", width: "54", height: "54" }), "AccessVerify"), React.createElement("button", { className: "info-button", onClick: this.toggleInfo }, "Tool info"), React.createElement("p", { className: this.state.showInfo ? "show info" : "hide info" }, "Basic check for the accessibility of the web"));
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