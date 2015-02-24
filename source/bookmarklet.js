(function () {

    let scriptSrc = document.getElementById('utt-bookmarklet').src;
    let rootPath  = scriptSrc.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)[0];
    let userKey   = scriptSrc.split('key=')[1].split('&')[0];

    function start() {
        require.config({
            baseUrl: rootPath,
            paths: {
                UTT: 'lib',
                React: 'bower_components/React/react'
            },
            shim: { exports: 'React' }
        });

        require(['UTT/setup'], (setup) => {
            setup.init();
        });
    }

    if (typeof require === 'undefined') {
        let s = document.createElement('script');
        s.onload = start;
        s.setAttribute('src', rootPath + 'bower_components/requirejs/require.js');
        document.body.appendChild(s);
    } else {
        start();
    }

}());

