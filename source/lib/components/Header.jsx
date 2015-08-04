define(['React', 'UTT/main'],
function (React) {

    let i18n;

    let Header = React.createClass({
        render() {
            let logoSrc     = require.toUrl("UTT/components/assets/images/logo.svg");
            let closeBtnSrc = require.toUrl("UTT/components/assets/images/close.svg");
            let UTT = require('UTT/main');

            i18n = this.props.i18n;
            return <div><div className="UTT-header">
                <h1>
                    <img src={logoSrc}
                        width="54" height="54" />
                    <span className="UTT-app-name">{i18n`TOOL_NAME`}</span>
                    <span className="UTT-app-byline">{i18n`TOOL_BYLINE`}</span>
                </h1>
                <button className="UTT-info-button" onClick={this.toggleInfo}>
                    {i18n`tool info`}
                </button>
                <input className="UTT-close-button" onClick={UTT.stop}
                    src={closeBtnSrc} alt={i18n`close`}
                    type="image"width="30" height="30" />

                </div>
                <p className={this.state.showInfo ? 'UTT-show UTT-info': 'UTT-hide UTT-info'}>
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