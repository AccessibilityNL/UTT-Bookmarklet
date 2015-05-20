define(['React', 'UTT/components/UttBookmarklet', './config', 'UTT/modules/home'],
function (React, UttBookmarklet, config, home) {
    let UTT;

    function createModuleActivator(mod) {
        return function () {
            require([mod.controller, ], (modController) => {
                React.render(React.createElement(
                    UttBookmarklet, {}, modController(mod.config, mod.locale)
                ), UTT.containerNode);
            });
        };
    }

    UTT = {
        bookmarkNode: null,
        containerNode: null,
        userKey: null,
        running: false,

        render () {
            UTT.running = true;
            React.render(UTT.bookmarkNode, UTT.containerNode);
        },

        init({userKey}) {
            let styleLink = UTT.createStyleNode();
            UTT.containerNode  = UTT.createContainerNode();
            UTT.userKey = userKey;

            config.modules = config.modules.map((mod) => {
                return Object.assign({
                    'activate': createModuleActivator(mod)
                }, mod);
            });

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
            let {modules, locale} = config;
            UTT.bookmarkNode = React.createElement(UttBookmarklet, null, home({modules}, locale));
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
