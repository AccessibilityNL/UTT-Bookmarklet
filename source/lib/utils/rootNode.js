define([],
function () {
	let container;
	const rootNodeId  = 'utt-bookmarklet-container';
	const styleNodeId = 'utt-bookmarklet-stylesheet';

	let rootNode = {

		getContainer() {
            container = document.getElementById(rootNodeId);
            if (!container) {
                container = rootNode.createContainer();
            }

            document.head.appendChild(rootNode.getStyleNode());
            document.body.appendChild(container);
			return container;
		},

        show() {
            window.setTimeout(() => container.className += 'display', 100);
        },

        hide() {
            window.setTimeout(() => {
                container.className = container.className
                                      .replace(/display/i, '').trim();
            }, 100);
        },

        createContainer() {
            let node = document.createElement('div');
            node.id = rootNodeId;
            rootNode.addStyle();
            rootNode.show();
            return node;
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

        addStyle() {
            let style = document.createElement('style');
            style.innerHTML = `
            #${rootNodeId} {
                position: fixed;
                top: 10px;
                right: 5%;
                width: 310px;
                padding: 5px;
                box-shadow: 0 0 15px RGBA(0, 0, 0, 0.6);
                background: white;
                z-index: 1000000000001;
                overflow:hidden;
                transition: opacity .5s,
                            height .2s,
                            top .5s;
                opacity: 0;
                height: 0px;
                top:0;
            }
            #${rootNodeId}.display {
                opacity:1;
                height: 440px;
                top: 10px;
            }`;
            document.head.appendChild(style);
        }
	};

	return rootNode;

});