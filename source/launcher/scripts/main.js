define(['./userkey'],
function (userkey) {
    let launcher = {};

    launcher.create =  function (options) {
        /*jshint scripturl:true*/
        let bookmarkletString = 'javascript:';
        let {elm} = options;

        // Catch input errors
        if (elm.nodeName.toLowerCase() !== 'a') {
            throw new Error('Bookmarklets launcher requires an <a /> element.');
        }

        // Prevent the bookmarklet from launching directly
        elm.addEventListener("click", (event) => {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        });

        bookmarkletString += launcher.getBookmarkletString(options);
        elm.setAttribute('href',  bookmarkletString);
    };

    launcher.getBookmarkletString = function (options) {
        let host       = options.host       || window.location.hostname;
        let port       = options.port       || ':' + window.location.port;
        let scriptPath = options.scriptPath || 'bookmarklet.js';
        let userKey    = options.userKey    || userkey.getKey();
        let folder     = options.folder     || '/';
        let modules    = options.modules    || [];

        let query = '?key=' + userKey + '&mds=' + modules.join();

        let url = '//' + host + port + folder + scriptPath + query;

        return '(function(){' +
            'var d=document,i="utt-bookmarklet",a="setAttribute";' +
            'if(!d.getElementById(i)){'+
                'var s=d.createElement("script");' +
                's[a]("src","' + url +'");' +
                's[a]("id",i);' +
                'd.body.appendChild(s);' +
            '}' +
        '}());';
    };

    return launcher;

});