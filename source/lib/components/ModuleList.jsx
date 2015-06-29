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
            let classes = 'module-item';
            if (mod.config.completed) {
                classes += ' completed';
            }

            return <li className={classes} key={i}>
                <img src={require.toUrl(
                        "UTT/components/assets/images/" + mod.config.icon
                    )}
                    width="30" height="30" alt="" role="presentation" />
                <h2>{mod.locale.CATG_TITLE}</h2>
                <p>{mod.locale.CATG_DESCR}</p>
                <button onClick={mod.activate}>
                    {(!mod.config.completed ? i18n`start` : i18n`restart`)}
                </button>
            </li>;
        }

    });

    return ModuleList;
});