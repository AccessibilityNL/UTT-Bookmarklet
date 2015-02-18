(function () {

	let scriptSrc = document.getElementById('utt-bookmarklet').src;
	let rootPath  = scriptSrc.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)[0];
	let userKey   = scriptSrc.split('key=')[1].split('&')[0];

	function start() {
		require.config({
		    baseUrl: rootPath,
		    paths: {
		        UTT: 'lib'
		    }
		});

		require(['UTT/setup'], function (setup) {
			setup.init();
		});
	}

	if (typeof require === 'undefined') {
		var s = document.createElement('script');
		s.onload = start;
		s.setAttribute('src', rootPath + 'bower_components/requirejs/require.js');
		document.body.appendChild(s);
	} else {
		start();
	}

}());

