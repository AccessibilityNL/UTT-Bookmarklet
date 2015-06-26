"use strict";

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

define(function () {
	console.warn("using MOCK connector!");
	var id = "@id";

	function mockRequest(url, obj) {
		for (var _len = arguments.length, params = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
			params[_key - 2] = arguments[_key];
		}

		var result = undefined;
		if (url.substr(-8) === "assertor") {
			result = (function () {
				var _result = {};

				_defineProperty(_result, id, url + "/fakeUserId");

				_defineProperty(_result, "@type", "http://xmlns.com/foaf/spec/#Person");

				return _result;
			})();
		} else {
			result = Object.assign({}, obj);
			if (!result[id]) {
				result[id] = url + "/FakeID!";
			}
		}

		console.log.apply(console, ["mock request to:", url, obj].concat(params, [result]));

		return new Promise(function (resolve) {
			setTimeout(resolve.bind(null, result), 100);
		});
	}

	var mockServer = {
		post: mockRequest,
		get: mockRequest,
		put: mockRequest,
		"delete": mockRequest
	};

	return mockServer;
});
//# sourceMappingURL=mockServer.js.map