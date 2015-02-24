define(['React'], function (React) {

	let Tab = React.createClass({
		render() {
			return <div className="tab">
				{this.props.children}
			</div>;
		}
	});

	return Tab;
});