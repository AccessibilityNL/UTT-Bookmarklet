define(['React', './Header', './ModuleList'],
function (React, Header, ModuleList) {
    let HomePanel = React.createClass({

        render() {
            return <div className="home">
                <Header></Header>
                <ModuleList modules={this.props.modules} />
                {this.renderResultLink()}
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
        }

    });
    return HomePanel;
});