define(['React', './Panel', './Header', 'UTT/utils/rootNode', 'UTT/utils/browser-polyfill'],
function (React, Panel, Header) {

    let UttBookmarklet = React.createClass({
        render() {
            return <Panel dragable={true}>
                <Header i18n={this.props.i18n}></Header>
                {this.props.children}
            </Panel>;
        }

    });
    return UttBookmarklet;
});