"use strict";

define(["React", "./Tab"], function (React, Tab) {

	var TabPanel = React.createClass({ displayName: "TabPanel",
		tabLength: 0,
		getInitialState: function getInitialState() {
			return {
				activeTab: 0
			};
		},

		changeTab: function changeTab(index) {
			this.setState({
				activeTab: index
			});
		},

		renderTabBar: function renderTabBar(tab, index) {
			var tabWidth = {
				width: Math.floor(100 / this.tabLength) + "%"
			};

			return React.createElement("a", { href: "#", style: tabWidth,
				key: "tab-item-" + index,
				className: this.state.activeTab === index ? "active" : "",
				onClick: (function () {
					return this.changeTab(index);
				}).bind(this) }, tab.props.name);
		},

		renderTabView: function renderTabView(tab, index) {
			var style = {
				display: this.state.activeTab === index ? "block" : "none"
			};
			return React.createElement("div", { style: style, key: "tab-view-" + index }, tab);
		},

		render: function render() {
			var children = this.props.children || [];
			this.tabLength = children.length;

			var tabBar = children.map(this.renderTabBar);
			var tabViews = children.map(this.renderTabView);

			return React.createElement("div", { className: "tab-panel" }, React.createElement("div", { className: "tab-bar" }, tabBar), tabViews);
		}
	});

	TabPanel.Tab = Tab;

	return TabPanel;
});
//# sourceMappingURL=TabPanel.js.map