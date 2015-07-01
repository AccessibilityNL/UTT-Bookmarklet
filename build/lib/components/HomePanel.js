"use strict";

define(["React", "./Header", "./ModuleList"], function (React, Header, ModuleList) {

    var i18n = undefined;

    var HomePanel = React.createClass({ displayName: "HomePanel",
        render: function render() {
            i18n = this.props.i18n;
            return React.createElement("div", { className: "home" }, React.createElement(Header, { i18n: i18n }), React.createElement(ModuleList, { modules: this.props.modules, i18n: i18n }), this.renderFooterModule());
        },

        renderFooterModule: function renderFooterModule() {
            return React.createElement("div", { className: "results-overview" }, React.createElement("ul", null, this.props.modules.map(this.renderModStatus)), React.createElement("button", { onClick: this.props.footerModule.activate }, i18n((function () {
                var siteObj = ["results"];siteObj.raw = ["results"];Object.freeze(siteObj.raw);Object.freeze(siteObj);return siteObj;
            })())));
        },

        renderModStatus: function renderModStatus(mod, i) {
            var alt = undefined;
            var icon = undefined;
            if (mod.config.completed) {
                alt = mod.locale.CATG_TITLE + " " + i18n((function () {
                    var siteObj = ["complete"];siteObj.raw = ["complete"];Object.freeze(siteObj.raw);Object.freeze(siteObj);return siteObj;
                })());
                icon = mod.config.iconComplete;
            } else {
                alt = mod.locale.CATG_TITLE + " " + i18n((function () {
                    var siteObj = ["incomplete"];siteObj.raw = ["incomplete"];Object.freeze(siteObj.raw);Object.freeze(siteObj);return siteObj;
                })());
                icon = mod.config.iconIncomplete;
            }

            return React.createElement("li", { key: i }, React.createElement("img", { src: require.toUrl("UTT/components/assets/images/" + icon), alt: alt, width: "24", height: "24" }));
        }

    });
    return HomePanel;
});
//# sourceMappingURL=HomePanel.js.map