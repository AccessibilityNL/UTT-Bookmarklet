define(['React', 'UTT/components/UttBookmarklet', './config',
    'UTT/modules/home', 'UTT/utils/translator',
    'UTT/utils/rootNode',
    'UTT/utils/browser-polyfill'],
function (React, UttBookmarklet, config, home, translator) {
    let UTT;

    config.i18n = translator({messageBundle: config.locale});
    let rootNode = require('UTT/utils/rootNode');

    function renderModule(comp, attr, children) {
        UTT.bookmarkNode = React.createElement(
            UttBookmarklet, {}, React.createElement(comp, attr, children)
        );
        UTT.render();
    }

    function createModuleActivator(mod) {
        return function () {
            require([mod.controller, ], (modController) => {
                let i18n = translator({
                    messageBundle: Object.assign(mod.locale, config.locale)
                });
                modController(mod.config, i18n, renderModule);
            });
        };
    }

    UTT = {
        bookmarkNode: null,
        containerNode: null,
        running: false,
        config: null,
        userKey: null,
        render () {
            UTT.running = true;
            React.render(UTT.bookmarkNode, rootNode.getContainer());
        },

        init({userKey}) {
            rootNode.getContainer();

            config.modules = config.modules.map((mod) => {
                return Object.assign({
                    'activate': createModuleActivator(mod)
                }, mod);
            });

            if (config.footerModule) {
                let mod = config.footerModule;
                config.footerModule = Object.assign({
                    'activate': createModuleActivator(mod)
                }, mod);
            }

            UTT.userKey = userKey;
            Object.freeze(config);
            UTT.config = config;
            UTT.showHome();
        },

        start() {
            UTT.render();
            rootNode.show();
        },

        stop() {
            UTT.running = false;
            rootNode.hide();
            React.unmountComponentAtNode(rootNode.getContainer());
        },

        showHome() {
            let {modules, footerModule, i18n} = config;
            UTT.bookmarkNode = React.createElement(
                        UttBookmarklet, null,
                        home({modules, footerModule}, i18n));

            UTT.render();
        },

        toggle() {
            UTT[UTT.running ? 'stop' : 'start']();
        },


    };

    return UTT;

});
