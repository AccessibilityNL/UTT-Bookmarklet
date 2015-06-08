define(['React'], function (React) {

    let ModuleList = React.createClass({
        /**
         * Render this module
         */
        render() {
            return <ul>
                {this.props.modules.map(this.renderModule)}
            </ul>;
        },

        /**
         * Render the name of a module
         */
        renderModule(mod, i) {
            return <li className="module" key={i}>
                <strong>{mod.title}</strong>
                <p>{mod.description}</p>
                <button onClick={mod.activate}>
                    Start testing
                </button>
            </li>;
        }
    });

    return ModuleList;
});