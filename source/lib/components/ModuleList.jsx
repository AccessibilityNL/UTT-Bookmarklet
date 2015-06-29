define(['React'],
function (React) {

    let i18n;

    let ModuleList = React.createClass({
        /**
         * Render this module
         */
        render() {
            i18n = this.props.i18n;
            return <ul className="content">
                {this.props.modules.map(this.renderModule)}
            </ul>;
        },

        /**
         * Render the name of a module
         */
        renderModule(mod, i) {
            if (mod.config.displayOnHome === false) {
                return;
            }

            return <li className="module-item" key={i}>
                <img src={require.toUrl(
                        "UTT/components/assets/images/" + mod.config.icon
                    )}
                    width="30" height="30" alt="" role="presentation" />
                <h2>{mod.locale.CATG_TITLE}</h2>
                <p>{mod.locale.CATG_DESCR}</p>
                <button onClick={mod.activate}>
                    {i18n`star testing`}
                </button>
            </li>;
        }

    });

    return ModuleList;
});