define(['React', 'UTT/components/UttBookmarklet', './config',
    'UTT/modules/home', 'UTT/utils/translator',
    'UTT/utils/browser-polyfill'],
function (React, UttBookmarklet, config, home, translator) {
    let UTT;

    config.i18n = translator({messageBundle: config.locale});

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
            React.render(UTT.bookmarkNode, UTT.containerNode);
        },

        init({userKey}) {
            let styleLink = UTT.createStyleNode();
            UTT.containerNode  = UTT.createContainerNode();
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

            document.head.appendChild(styleLink);
            document.body.appendChild(UTT.containerNode);

            this.showHome();
        },

        start() {
            UTT.render();
        },

        stop() {
            UTT.running = false;
            React.unmountComponentAtNode(UTT.containerNode);
        },

        showHome() {
            let {modules, footerModule, i18n} = config;
            UTT.bookmarkNode = React.createElement(
                        UttBookmarklet, null,
                        home({modules, footerModule}, i18n));

            React.render(UTT.bookmarkNode, UTT.containerNode);
        },

        toggle() {
            UTT[UTT.running ? 'stop' : 'start']();
        },

        createStyleNode() {
            let id = 'utt-bookmarklet-stylesheet';
            let link = document.getElementById(id);
            if (!link) {
                link = document.createElement('link');
                link.id = id;
                link.setAttribute('rel', 'stylesheet');
                link.setAttribute('href',
                    require.toUrl("UTT/components/assets/styles/main.css")
                );
            }
            return link;
        },

        createContainerNode() {
            let id = 'utt-bookmarklet-container';
            let containerNode = document.getElementById(id);
            if (!containerNode) {
                containerNode = document.createElement('div');
                containerNode.id = id;
            }
            return containerNode;
        }
    };

    return UTT;

});
