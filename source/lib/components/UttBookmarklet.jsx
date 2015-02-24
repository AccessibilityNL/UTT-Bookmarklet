define(['React', './Panel', './TabPanel'],
function (React, Panel, TabPanel) {
	let Tab = TabPanel.Tab;

	let UttBookmarklet = React.createClass({
		render() {
			return <Panel>
				<h1>Hello Bookmarklet</h1>
				<TabPanel>
				  <Tab name="Foo">Hello Foo</Tab>
				  <Tab name="Bar">Hello Bar</Tab>
				</TabPanel>
			</Panel>;
		}
	});

	return UttBookmarklet;
});