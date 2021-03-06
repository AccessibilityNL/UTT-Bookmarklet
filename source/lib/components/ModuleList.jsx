/**
 * ModuleList takes an array of modules and renders them as a list. The modules
 * should have the following properties:
 *   icon (src string), title, description, activate (function), completed (bool)
 */
define(['React'],
function (React) {

    let i18n;

    let ModuleList = React.createClass({

        getInitialState() {
            return {leaving: false};
        },

        /**
         * Render this module
         */
        render() {
            i18n = this.props.i18n;
            let className = (!this.state.leaving ? '' : ' exit-left');

            return <ul className={className}>
                {this.props.modules.map(this.renderModule)}
            </ul>;
        },

        openModule(mod) {


            let leaving;
            if (mod.activate) {
                leaving = mod.activate();

            } else if (this.props.openModule) {
                leaving = this.props.openModule(mod);
            }

            if (leaving !== false) {
                if (this.props.exitStage) {
                    this.props.exitStage(()=>{});
                }
                this.setState({ leaving: true });
            }
        },

        /**
         * Render the name of a module
         */
        renderModule(mod, i) {
            let classes = 'module-item';
            if (mod.completed) {
                classes += ' completed';
            }

            return <li className={classes} key={i}>
                <img width="30" height="30"
                 src={require.toUrl("UTT/components/assets/images/" + mod.icon)}
                 alt="" role="presentation" />
                <h2>{mod.title}</h2>
                <p>{mod.description}</p>
                <button onClick={this.openModule.bind(this, mod)}>{
                    (!mod.completed ? i18n('BTN_OPEN')
                                    : i18n('BTN_OPEN_COMPLETE'))
                }</button>
            </li>;
        }

    });

    return ModuleList;
});