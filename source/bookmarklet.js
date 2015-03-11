(function () {

    let scriptSrc = document.getElementById('utt-bookmarklet').src;
    let baseUrl  = scriptSrc.substring(0, scriptSrc.lastIndexOf("/") + 1);
    let userKey   = (scriptSrc.split('key=')[1] || '').split('&')[0];
    let modules   = (scriptSrc.split('mds=')[1] || '').split('&')[0].split(',');

    function start() {
        require.config({
            baseUrl,
            paths: {
                UTT: 'lib',
                React: 'bower_components/React/react'
            },
            shim: { exports: 'React' }
        });

        require(['UTT/main'], (UTT) => {
            UTT.init({
                userKey: userKey,
                modules: modules,
                launch: true,
            });
        });
    }

    if (typeof require === 'undefined') {
        let s = document.createElement('script');
        s.onload = start;
        s.setAttribute('src', baseUrl + 'bower_components/requirejs/require.js');
        document.body.appendChild(s);
    } else {
        start();
    }

}());

