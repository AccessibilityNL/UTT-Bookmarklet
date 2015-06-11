define(['React'], function (React) {

    let ModuleList = React.createClass({
        /**
         * Render this module
         */
        render() {
            return <ul className="content">
                {this.props.modules.map(this.renderModule)}
            </ul>;
        },

        /**
         * Render the name of a module
         */
        renderModule(mod, i) {
            return <li className="module-item" key={i}>
                <img src="" width="30" height="30" alt="" role="presentation" />
                <h2>{mod.title}</h2>
                <p>{mod.description}</p>
                <button onClick={mod.activate}>
                    Start testing
                </button>
            </li>;
        }

    });

    return ModuleList;
});