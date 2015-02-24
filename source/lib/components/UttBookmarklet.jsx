define(['React', './Panel'], function (React, Panel) {

	let UttBookmarklet = React.createClass({
		render() {
			return <Panel>
				<h1>Hello Bookmarklet</h1>
				<p>It works!</p>
			</Panel>;
		}
	});

	return UttBookmarklet;
});