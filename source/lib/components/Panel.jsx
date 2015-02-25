define(['React'], function (React) {

	let Panel = React.createClass({
		render() {
			return <div className="panel">
				{this.props.children}
			</div>;
		}
	});

	return Panel;
});