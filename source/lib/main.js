define(['React', 'UTT/components/UttBookmarklet'],
function (React, UttBookmarklet) {

    let UTT = {
        modulesLoaded(...modules) {
            console.log(modules);
            modules.forEach((mdl) => mdl.init());
        },

        init({modules/*, userKey*/}) {
            let styleLink = UTT.createStyleNode();
            let rootNode  = UTT.createRootNode();

            // Prefix module names
            modules = modules.map((modName) => 'UTT/modules/' + modName + '/main');

            require(modules, UTT.modulesLoaded);

            document.head.appendChild(styleLink);
            document.body.appendChild(rootNode);

            React.render(
                React.createElement(UttBookmarklet, null),
                rootNode
            );

            console.log('setup initiatied');
        },

        createStyleNode() {
            var link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('href',
                require.toUrl("UTT/components/assets/styles/main.css")
            );
            return link;
        },

        createRootNode() {
            let rootNode = document.createElement('div');
            rootNode.id = 'utt-bookmarklet-root';
            return rootNode;
        }
    };

    return UTT;

});
