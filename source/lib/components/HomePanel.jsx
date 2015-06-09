define(['React', './ModuleList'],
function (React, ModuleList) {
    let HomePanel = React.createClass({

        render() {
            return <div className="home">
                {this.renderHeader()}
                <ModuleList modules={this.props.modules} />
                {this.renderResultLink()}
            </div>;
        },

        renderHeader() {
            return <div className="header">
                <h1>
                    <img src="" width="54" height="54" />
                    AccessVerify
                </h1>
                <button className="info-button" onClick={this.toggleInfo}>Tool info</button>
                <p className={this.state.showInfo ? 'show info': 'hide info'}>
                    Basic check for the accessibility of the web
                </p>
            </div>;
        },

        renderResultLink() {
            return <div className="results-overview">
                <ul>
                    <li><img src="" alt="TODO" width="24" height="24" /></li>
                    <li><img src="" alt="TODO" width="24" height="24" /></li>
                    <li><img src="" alt="TODO" width="24" height="24" /></li>
                    <li><img src="" alt="TODO" width="24" height="24" /></li>
                    <li><img src="" alt="TODO" width="24" height="24" /></li>
                </ul>
                <button>Results</button>
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