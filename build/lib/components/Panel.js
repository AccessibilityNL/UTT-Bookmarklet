"use strict";

define(["React"], function (React) {
	var Panel = React.createClass({ displayName: "Panel",
		getInitialState: function getInitialState() {
			return {
				moving: false,
				clientX: false,
				clientY: false };
		},
		render: function render() {
			var mouseDown = undefined;
			var mouseUp = undefined;

			if (this.props.dragable) {
				mouseDown = this.mouseDown;
				mouseUp = this.mouseUp;
			}

			return React.createElement("div", { className: "panel",
				onMouseDown: mouseDown, onMouseUp: mouseUp,
				onMouseMove: this.state.moving ? this.drag : null }, this.props.children);
		},
		mouseDown: function mouseDown(e) {
			this.setState({
				moving: true,
				clientX: e.clientX,
				clientY: e.clientY
			});
		},
		mouseUp: function mouseUp() {
			this.setState({
				moving: false,
				clientX: false,
				clientY: false
			});
		},

		drag: function drag(e) {}
	});

	return Panel;
});

// TODO
//# sourceMappingURL=Panel.js.map