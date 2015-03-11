"use strict";

define(["React", "./Panel", "./TabPanel"], function (React, Panel, TabPanel) {

	var Tab = TabPanel.Tab;
	var iconSrc = require.toUrl("UTT/components/assets/images/utt-icon.png");

	var UttBookmarklet = React.createClass({ displayName: "UttBookmarklet",
		render: function render() {
			return React.createElement(Panel, null, React.createElement("h1", { className: "title" }, React.createElement("img", { src: iconSrc, alt: "UTT", width: "12", height: "12" }), "Hello Bookmarklet"), React.createElement(TabPanel, null, this.props.modules.map(function (module, index) {
				return React.createElement(Tab, { name: module.name, key: "module-" + index }, module.component);
			})));
		}
	});

	return UttBookmarklet;
});
//# sourceMappingURL=UttBookmarklet.js.map