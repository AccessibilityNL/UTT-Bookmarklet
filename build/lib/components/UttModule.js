"use strict";

define(["React", "UTT/main", "./Header"], function (React, UTT, Header) {

	var i18n = undefined;
	var UttModule = React.createClass({ displayName: "UttModule",

		getInitialState: function getInitialState() {
			setTimeout((function () {
				return this.setState({ enter: true });
			}).bind(this), 10);
			return { enter: false };
		},

		render: function render() {
			i18n = this.props.i18n;
			var animation = " fade";
			if (this.state.enter) {
				animation += " enter";
			}

			return React.createElement("div", { className: this.props.className + " module" }, React.createElement("div", { className: "content " + animation }, this.props.children), React.createElement("div", { className: "footer" }, React.createElement("p", null, React.createElement("a", { href: "", onClick: this.home }, React.createElement("img", { src: require.toUrl("UTT/components/assets/images/home.svg"), alt: "", role: "presentation",
				width: "14", height: "14" }), i18n((function () {
				var siteObj = ["Back to overview"];siteObj.raw = ["Back to overview"];Object.freeze(siteObj.raw);Object.freeze(siteObj);return siteObj;
			})())))));
		},

		home: function home(e) {
			e.preventDefault();
			this.setState({ enter: false });
			setTimeout(function () {
				return UTT.showHome();
			}, 300);
		}
	});

	return UttModule;
});
//# sourceMappingURL=UttModule.js.map