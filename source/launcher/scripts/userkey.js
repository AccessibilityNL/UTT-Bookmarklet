define(function() {

	let cookieName = 'userkey';

    function createCookie(name, value, days) {
        var expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    }

    let userKey = {
    	getKey() {
    		let key = readCookie(cookieName);
    		if (!key) {
    			key = userKey.createNewKey();
    			createCookie(cookieName, key);
    		}
    		return key;
    	},

    	createNewKey() {
    		return userKey.randomString(64);
    	},

    	randomString(len, charSet) {
		    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		    let randomString = '';
		    for (let i = 0; i < len; i++) {
		    	let randomPoz = Math.floor(Math.random() * charSet.length);
		    	randomString += charSet.substring(randomPoz,randomPoz+1);
		    }
		    return randomString;
		}
    };

    return userKey;
});