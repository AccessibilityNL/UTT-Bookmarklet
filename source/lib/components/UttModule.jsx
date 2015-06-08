define(['React', 'UTT/main'],
function (React, UTT) {

	let UttModule = React.createClass({
		render() {
			return <div className="module">
				<h2>Title of the booklet</h2>
				<button onClick={UTT.showHome}>Home</button>
				<div>{this.props.children}</div>
			</div>;
		}
	});

	return UttModule;
});