define(['React'],
function (React) {
	let Panel = React.createClass({
		getInitialState() {
			return { moving: false };
		},
		render() {
			return <div className="panel"
				onMouseDown={this.mouseDown} onMouseUp={this.mouseUp}
				onMouseMove={( this.state.moving ? this.props.onMove : null )}>
				{this.props.children}
			</div>;
		},
		mouseDown() {
			this.setState({moving: true});
		},
		mouseUp() {
			this.setState({moving: false});
		}
	});

	return Panel;
});