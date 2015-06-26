define(function () {
	console.warn('using MOCK connector!');
	let id = '@id';

	function mockRequest(url, obj, ...params) {

		let result;
		if (url.substr(-8) === 'assertor') {
			result = {
			  [id]:    url + "/fakeUserId",
			  "@type": "http://xmlns.com/foaf/spec/#Person",
			};

		} else {
			result = Object.assign({}, obj);
			if (!result[id]) {
				result[id] = url + '/FakeID!';
			}
		}

		console.log('mock request to:', url, obj, ...params, result);

		return new Promise(function(resolve) {
			setTimeout(resolve.bind(null, result), 100);
		});

	}

	let mockServer = {
		post:   mockRequest,
		get:    mockRequest,
		put:    mockRequest,
		delete: mockRequest
	};

	return mockServer;
});