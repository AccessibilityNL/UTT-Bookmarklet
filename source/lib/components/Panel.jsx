define(['React'],
function (React) {
	let Panel = React.createClass({
		getInitialState() {
			return {
				moving: false,
				clientX: false,
				clientY: false,
			};
		},
		render() {
			let mouseDown;
			let mouseUp;

			if (this.props.dragable) {
				mouseDown = this.mouseDown;
				mouseUp   = this.mouseUp;
			}

			return <div className="panel"
				onMouseDown={mouseDown} onMouseUp={mouseUp}
				onMouseMove={( this.state.moving ? this.drag : null )}>
				{this.props.children}
			</div>;
		},
		mouseDown(e) {
			this.setState({
				moving:  true,
				clientX: e.clientX,
				clientY: e.clientY
			});
		},
		mouseUp() {
			this.setState({
				moving:  false,
				clientX: false,
				clientY: false
			});
		},

		drag(e) {
			// TODO
		}
	});

	return Panel;
});