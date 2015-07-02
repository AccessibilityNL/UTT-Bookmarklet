define([],
function () {
	let container;
	const rootNodeId  = 'utt-bookmarklet-container';
	const styleNodeId = 'utt-bookmarklet-stylesheet';

	let rootNode = {
		getContainer() {
            container = document.getElementById(rootNodeId);
            if (!container) {
                container = document.createElement('div');
                container.id = rootNodeId;
            }

            document.head.appendChild(rootNode.getStyleNode());
            document.body.appendChild(container);
			return container;
		},

        getStyleNode() {
            let link = document.getElementById(styleNodeId);
            if (!link) {
                link = document.createElement('link');
                link.id = styleNodeId;
                link.setAttribute('rel', 'stylesheet');
                link.setAttribute('href',
                    require.toUrl("UTT/components/assets/styles/main.css")
                );
            }
            return link;
        },
	};

	return rootNode;

});