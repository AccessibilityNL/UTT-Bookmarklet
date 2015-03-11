define(['./cookie'],
function (cookie) {

	let keyGen = {
		randomString(len, charSet) {
		    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		    let randomString = '';
		    for (let i = 0; i < len; i++) {
		    	let randomPoz = Math.floor(Math.random() * charSet.length);
		    	randomString += charSet.substring(randomPoz, randomPoz + 1);
		    }
		    return randomString;
		},

		createKey() {
			return keyGen.randomString(64);
		},

		getUserKey() {
			let key = cookie.get('userkey');
			if (!key) {
				key = keyGen.createKey();
				cookie.set('userkey', key);
			}
			return key;
		}
	};

	return keyGen;
});