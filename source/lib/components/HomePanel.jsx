define(['React', './ModuleList'],
function (React, ModuleList) {
    let HomePanel = React.createClass({

        render() {
            return <div className="home">
                {this.renderHeader()}
                <p className="result-list">Result list</p>
                <ModuleList modules={this.props.modules} />
                <button>Results</button>
            </div>;
        },

        renderHeader() {
            return <div className="header">
                <h1>
                    <img src="" width="40" height="40" />
                    AccessVerify
                </h1>
                <button className="info-button" onClick={this.toggleInfo}>Tool info</button>
                <p className={this.state.showInfo ? 'show info': 'hide info'}>
                    Basic check for the accessibility of the web
                </p>
            </div>;
        },

        getInitialState() {
            return { showInfo: false };
        },

        toggleInfo() {
            console.log(this.state.showInfo);
            this.setState({
                showInfo: !this.state.showInfo
            });
        }

    });
    return HomePanel;
});