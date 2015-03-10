define(['React', './Tab'], function (React, Tab) {

	let TabPanel = React.createClass({
		tabLength: 0,
		getInitialState() {
			return {
				activeTab: 0
			};
		},

		changeTab(index) {
			this.setState({
				activeTab: index
			});
		},

		renderTabBar(tab, index) {
			let tabWidth = {
				width: Math.floor(100 / this.tabLength) + '%'
			};

			return <a href="#" style={tabWidth}
			key={'tab-item-' + index}
			className={ this.state.activeTab === index ? 'active': '' }
			onClick={ ()=> this.changeTab(index) }>
				{tab.props.name}
			</a>;
		},

		renderTabView(tab, index) {
			let style = {
				display: (this.state.activeTab === index ? 'block' : 'none')
			};
			return <div style={style} key={'tab-view-' + index}>
				{tab}
			</div>;
		},

		render() {
			let children   = this.props.children || [];
			this.tabLength = children.length;

			let tabBar   = children.map(this.renderTabBar);
			let tabViews = children.map(this.renderTabView);

			return <div className="tab-panel">
				<div className="tab-bar">{tabBar}</div>
				{tabViews}
			</div>;
		}
	});

	TabPanel.Tab = Tab;

	return TabPanel;
});