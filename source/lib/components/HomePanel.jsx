define(['React', './Header', './ModuleList'],
function (React, Header, ModuleList) {

    let i18n;

    let HomePanel = React.createClass({
        getInitialState() {
            setTimeout(() => this.setState({enter: true}), 10);
            return {enter: false};
        },

        render() {
            i18n = this.props.i18n;
            let animation =  " UTT-slide-left UTT-fade";

            if (this.state.enter) {
                animation += ' UTT-enter';
            }

            i18n = this.props.i18n;
            return <div className={"UTT-home" + animation}>
                <ModuleList modules={this.props.modules} i18n={i18n} />
                {this.renderFooterModule()}
            </div>;
        },

        renderFooterModule() {
            return <div className="UTT-results-overview">
                <ul>
                    {this.props.modules.map(this.renderModStatus)}
                </ul>
                <button onClick={this.props.footerModule.activate}>
                    {i18n`results`}
                </button>
            </div>;
        },

        renderModStatus(mod, i) {
            let alt;
            let icon;
            if (mod.config.completed) {
                alt  = mod.locale.CATG_TITLE + ' ' + i18n`complete`;
                icon = mod.config.iconComplete;

            } else {
                alt = mod.locale.CATG_TITLE + ' ' + i18n`incomplete`;
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