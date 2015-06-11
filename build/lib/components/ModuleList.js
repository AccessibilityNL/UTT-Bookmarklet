"use strict";

define(["React"], function (React) {

    var ModuleList = React.createClass({ displayName: "ModuleList",
        /**
         * Render this module
         */
        render: function render() {
            return React.createElement("ul", { className: "content" }, this.props.modules.map(this.renderModule));
        },

        /**
         * Render the name of a module
         */
        renderModule: function renderModule(mod, i) {
            return React.createElement("li", { className: "module-item", key: i }, React.createElement("img", { src: "", width: "30", height: "30", alt: "", role: "presentation" }), React.createElement("h2", null, mod.title), React.createElement("p", null, mod.description), React.createElement("button", { onClick: mod.activate }, "Start testing"));
        }

    });

    return ModuleList;
});
//# sourceMappingURL=ModuleList.js.map