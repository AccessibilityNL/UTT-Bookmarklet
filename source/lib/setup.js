define(['React', 'UTT/components/UttBookmarklet'],
function (React, UttBookmarklet) {

    let setup = {
        init() {
            let styleLink = setup.createStyleNode()
            let rootNode  = setup.createRootNode();

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

    return setup;

});
