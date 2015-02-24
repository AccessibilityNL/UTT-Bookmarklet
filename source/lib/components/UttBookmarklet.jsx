define(['React', './Panel', './TabPanel'],
function (React, Panel, TabPanel) {

	let Tab = TabPanel.Tab;
	let iconSrc = require.toUrl(
		"UTT/components/assets/images/utt-icon.png"
	);

	let UttBookmarklet = React.createClass({
		render() {
			return <Panel>
				<h1 className="title">
					<img src={iconSrc} alt="UTT" width="12" height="12" />
					Hello Bookmarklet
				</h1>
				<TabPanel>
				  <Tab name="Foo">Hello Foo</Tab>
				  <Tab name="Bar">Hello Bar</Tab>
				</TabPanel>
			</Panel>;
		}
	});

	return UttBookmarklet;
});