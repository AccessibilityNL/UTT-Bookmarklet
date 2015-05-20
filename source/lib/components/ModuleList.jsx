define(['React'], function (React) {
    let ModuleList = React.createClass({
        /**
         * Render the name of a module
         */
        renderModule(mod) {
            return <li className="module">
                <strong>{mod.title}</strong>
                <p>{mod.description}</p>
                <button onClick={mod.activate}>
                    Start testing
                </button>
            </li>;
        },

        /**
         * Render this module
         */
        render() {
            return <ul>
                {this.props.modules.map(this.renderModule)}
            </ul>;
        }
    });
    return ModuleList;
});