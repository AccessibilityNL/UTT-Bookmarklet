"use strict";

define(["React"], function (React) {

	var Tab = React.createClass({ displayName: "Tab",
		render: function render() {
			return React.createElement("div", { className: "tab" }, this.props.children);
		}
	});

	return Tab;
});
//# sourceMappingURL=Tab.js.map