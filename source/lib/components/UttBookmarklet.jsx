define(['React', './Panel', './browser-polyfill'],
function (React, Panel) {
    let UttBookmarklet = React.createClass({
        render() {
            return <Panel>
                {this.props.children}
            </Panel>;
        }
    });
    return UttBookmarklet;
});