define(['React', 'UTT/components/UttBookmarklet'],
function (React, UttBookmarklet) {

    let UTT = {
        bookmarkNode: null,
        containerNode: null,
        userKey: null,

        modulesLoaded(...modules) {
            let options = {userKey: UTT.userKey};
            modules.forEach((module) => module.init(options));
            UTT.bookmarkNode.props.modules = modules;
            React.render(UTT.bookmarkNode, UTT.containerNode);
        },

        init({modules, userKey}) {
            let styleLink = UTT.createStyleNode();
            UTT.containerNode  = UTT.createContainerNode();
            UTT.userKey = userKey;

            // Prefix module names
            modules = modules.map((modName) => 'UTT/modules/' + modName + '/' + modName);

            require(modules, UTT.modulesLoaded);

            document.head.appendChild(styleLink);
            document.body.appendChild(UTT.containerNode);

            UTT.bookmarkNode = React.createElement(UttBookmarklet, {modules: []});
            React.render(UTT.bookmarkNode, UTT.containerNode);
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
