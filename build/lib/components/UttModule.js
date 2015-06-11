"use strict";

define(["React", "UTT/main", "./Header"], function (React, UTT, Header) {

	var UttModule = React.createClass({ displayName: "UttModule",
		render: function render() {
			return React.createElement("div", { className: this.props.className + " module" }, React.createElement(Header, null), React.createElement("div", { "class": "content" }, this.props.children), React.createElement("div", { className: "footer" }, React.createElement("p", null, React.createElement("a", { href: "", onClick: this.home }, "Back to overview"))));
		},
		home: function home(e) {
			e.preventDefault();
			UTT.showHome();
		}
	});

	return UttModule;
});
//# sourceMappingURL=UttModule.js.map