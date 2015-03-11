"use strict";

define(["React"], function (React) {

	var Panel = React.createClass({ displayName: "Panel",
		render: function render() {
			return React.createElement("div", { className: "panel" }, this.props.children);
		}
	});

	return Panel;
});
//# sourceMappingURL=Panel.js.map