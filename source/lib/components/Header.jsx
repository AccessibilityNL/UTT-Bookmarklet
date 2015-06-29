define(['React', 'UTT/main'],
function (React) {

    let i18n;

    let Header = React.createClass({
        render() {
            let logoSrc = require.toUrl("UTT/components/assets/images/logo.svg");
            let UTT = require('UTT/main');

            i18n = this.props.i18n;
            return <div className="header">
                <h1>
                    <img src={logoSrc}
                        width="54" height="54" />
                    {i18n`TOOL_NAME`}
                </h1>
                <button className="info-button" onClick={this.toggleInfo}>
                    {i18n`tool info`}
                </button>
                <button className="close-button" onClick={UTT.stop}>
                    {i18n`close`}
                </button>
                <p className={this.state.showInfo ? 'show info': 'hide info'}>
                    {i18n`TOOL_DESCR`}
                </p>
            </div>;
    	},

        getInitialState() {
            return { showInfo: false };
        },

        toggleInfo() {
            this.setState({
                showInfo: !this.state.showInfo
            });
        }

	});

    return Header;
});