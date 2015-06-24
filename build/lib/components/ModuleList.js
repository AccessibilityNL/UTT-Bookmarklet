"use strict";

define(["React"], function (React) {

    var i18n = undefined;

    var ModuleList = React.createClass({ displayName: "ModuleList",
        /**
         * Render this module
         */
        render: function render() {
            i18n = this.props.i18n;
            return React.createElement("ul", { className: "content" }, this.props.modules.map(this.renderModule));
        },

        /**
         * Render the name of a module
         */
        renderModule: function renderModule(mod, i) {
            return React.createElement("li", { className: "module-item", key: i }, React.createElement("img", { src: require.toUrl("UTT/components/assets/images/" + mod.config.icon),
                width: "30", height: "30", alt: "", role: "presentation" }), React.createElement("h2", null, mod.locale.CATG_TITLE), React.createElement("p", null, mod.locale.CATG_DESCR), React.createElement("button", { onClick: mod.activate }, i18n((function () {
                var siteObj = ["star testing"];siteObj.raw = ["star testing"];Object.freeze(siteObj.raw);Object.freeze(siteObj);return siteObj;
            })())));
        }

    });

    return ModuleList;
});
//# sourceMappingURL=ModuleList.js.map