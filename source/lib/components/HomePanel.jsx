define(['React', './Header', './ModuleList'],
function (React, Header, ModuleList) {

    let i18n;

    let HomePanel = React.createClass({
        render() {
            i18n = this.props.i18n;
            return <div className="home">
                <Header i18n={i18n}></Header>
                <ModuleList modules={this.props.modules} i18n={i18n} />
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
                <button>{i18n`results`}</button>
            </div>;
        }

    });
    return HomePanel;
});