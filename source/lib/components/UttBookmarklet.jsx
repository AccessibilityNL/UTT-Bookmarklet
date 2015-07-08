define(['React', './Panel', './Header', 'UTT/utils/rootNode', 'UTT/utils/browser-polyfill'],
function (React, Panel, Header, UttRoot) {
    let lastX, lastY;

    let UttBookmarklet = React.createClass({

        render() {
            return <Panel onMove={this.move}>
                <Header i18n={this.props.i18n}></Header>
                {this.props.children}
            </Panel>;
        },

        move(e) {
            // let conatiner = UttRoot.getContainer();
            // if (lastX && lastY) {
            //     conatiner.style.left = e.clientX - conatiner.offsetLeft + "px";
            //     conatiner.style.top  = e.clientY - conatiner.offsetTop + "px";
            // }
            // console.log(conatiner.style.left, e.clientX - (e.clientX - conatiner.offsetLeft) + "px");

            // lastX = e.clientX;
            // lastY = e.clientY;
        }
    });
    return UttBookmarklet;
});