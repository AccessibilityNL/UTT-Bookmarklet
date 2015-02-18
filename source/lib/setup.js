define([], function () {
    return {
        init: function () {
            let rootNode = document.createElement('div');
            document.body.appendChild(rootNode);
            rootNode.setAttribute('style', `
                position:      fixed;
                top:           10px;
                left:          25%;
                width:         50%;
                min-height:    5em;
                background:    white;
                border:        solid grey 1px;
                border-radius: 5px;
                padding:       1em;
                z-index:       99999999;
                opacity:       0.95;
            `);
            rootNode.innerHTML = `
                <h1>Hello bookmarklet!</h1>
                <p>Let's go to work</p>
            `;
            console.log('setup initiatied');
        }
    };

});
