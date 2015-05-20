define(['React', './Panel', './HomePanel'],
function (React, Panel, HomePanel) {


    let UttBookmarklet = React.createClass({
        render() {
            return <Panel>
                <HomePanel modules={this.props.modules}
                           locale={this.props.locale} />
            </Panel>;
        }
    });

    return UttBookmarklet;
});