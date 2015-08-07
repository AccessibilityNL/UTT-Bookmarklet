define(['React', './Header', './ModuleList'],
function (React, Header, ModuleList) {

    let i18n;

    let HomePanel = React.createClass({
        getInitialState() {
            setTimeout(() => this.setState({enter: true}), 10);
            return { enter: false };
        },

        render() {
            i18n = this.props.i18n;
            let animation =  " slide-left fade";

            if (this.state.enter) {
                animation += ' enter';
            }

            i18n = this.props.i18n;
            return <div className={"home" + animation}>
                <ModuleList exitStage={this.exitStage}
                 modules={this.props.modules} i18n={i18n} />
                {this.renderFooterModule()}
            </div>;
        },

        renderFooterModule() {
            return <div className="results-overview">
                <ul>
                    {this.props.modules.map(this.renderModStatus)}
                </ul>
                <button onClick={this.exitStage.bind(
                    this, this.props.footerModule.activate
                )}>
                    {i18n`results`}
                </button>
            </div>;
        },

        exitStage(callback) {
            this.setState({enter: false});
            setTimeout(callback, 100);
        },

        renderModStatus(mod, i) {
            let alt;
            let icon;
            if (mod.completed) {
                alt  = mod.title + ' ' + i18n`complete`;
                icon = mod.config.iconComplete;

            } else {
                alt = mod.title + ' ' + i18n`incomplete`;
                icon = mod.config.iconIncomplete;
            }

            return <li key={i}>
                <img src={require.toUrl(
                    "UTT/components/assets/images/" + icon
                )} alt={alt} width="24" height="24" />
            </li>;
        }

    });
    return HomePanel;
});