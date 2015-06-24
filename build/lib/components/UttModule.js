"use strict";

define(["React", "UTT/main", "./Header"], function (React, UTT, Header) {

	var i18n = undefined;
	var UttModule = React.createClass({ displayName: "UttModule",
		render: function render() {
			i18n = this.props.i18n;
			return React.createElement("div", { className: this.props.className + " module" }, React.createElement(Header, { i18n: i18n }), React.createElement("div", { className: "content" }, this.props.children), React.createElement("div", { className: "footer" }, React.createElement("p", null, React.createElement("a", { href: "", onClick: this.home }, "Back to overview"))));
		},
		home: function home(e) {
			e.preventDefault();
			UTT.showHome();
		}
	});

	return UttModule;
});
//# sourceMappingURL=UttModule.js.map