define(['React', './Panel', 'UTT/utils/browser-polyfill'],
function (React, Panel) {

	let ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
	console.log('animation not working because CSS is not yet loaded');

    let UttBookmarklet = React.createClass({
        render() {
            return <ReactCSSTransitionGroup transitionName="example"
            		transitionAppear={true}>
            	<Panel>{this.props.children}</Panel>
        	</ReactCSSTransitionGroup>;
        }
    });
    return UttBookmarklet;
});