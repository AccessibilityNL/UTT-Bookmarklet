var EIII = EIII || {};

EIII.BookmarkletLauncher =  function (options) {
	/*jshint scripturl:true*/
	let bookmarkletString = 'javascript: ';
	let {elm} = options;

	// Catch input errors
	if (elm.nodeName.toLowerCase() !== 'a') {
		throw new Error('Bookmarklets launcher requires an <a /> element.');
	}

	// Prevent the bookmarklet from launching directly
	elm.addEventListener("click", function (event) {
		if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
	});

	bookmarkletString += EIII.BookmarkletLauncher.getBookmarkletString(options);
	elm.setAttribute('href',  bookmarkletString);
};

EIII.BookmarkletLauncher.getBookmarkletString = function (options) {
	let host 	   = options.host       || '127.0.0.1';
	let port 	   = options.port       || ':9000';
	let scriptPath = options.scriptPath || 'bookmarklet.js';
	let userKey    = options.userKey    || '1234567890';
	let protocol   = (document.location.protocol === 'https:' ? 'https://' : 'http://');

	let url = '//' + host + port + '/' + scriptPath + '?key=' + userKey;

	return '(function () {' +
        'var id="utt-bookmarklet";' +
        'if(!document.getElementById(id)){'+
	    	'var s = document.createElement("script");' +
		    's.setAttribute("src", "' + url +'");' +
		    's.setAttribute("id", id);' +
		    'document.body.appendChild(s);' +
	 	'}' +
 	'}());';
};