define(['React'], function (React) {

	let Panel = React.createClass({
		footbar() {
			alert(1234);
		},
		render() {
			return <div className="panel" onClick={this.foobar}>
				{this.props.children}
			</div>;
		}
	});

	return Panel;
});