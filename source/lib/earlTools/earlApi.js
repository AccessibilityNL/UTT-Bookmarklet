define(['qwest'],
function (qwest) {
	let knownTypes = ['assertor', 'evaluation', 'webpage', 'assertion'];

	function getUrlForEarl(apiUrl, earlObj) {
		let id = '';
		if (knownTypes.indexOf(earlObj.type) === -1) {
			throw 'Unknown EARL type ' + earlObj.typetype;
		}

		if (typeof earlObj['@id'] === 'string') {
			id = '/' + earlObj['@id'];
		}
		return apiUrl + '/' + earlObj.type + id;
	}


	let userKeys = {
		evaluation: 'creator',
		assertion: 'assertedBy'
	};

	function signEarlData(userData, earlObj) {
		let type = earlObj.type;
		let base = {};
		if (userKeys[type]) {
			base[userKeys[type]] = userData;
		}
		return Object.assign(base, earlObj);
	}

	function createAdapter(apiUrl, userData) {
		let earlAdapter = {
			post(earlObj) {
				if (earlObj['@id']) {
					throw `Error: can not create EARL ${earlObj.type} with an existing ID (${earlObj['@id']}).`;
				}
				return qwest.post(getUrlForEarl(apiUrl, earlObj),
								  signEarlData(userData, earlObj));
			},

			get(earlObj) {
				return qwest.get(getUrlForEarl(apiUrl, earlObj),
								 signEarlData(userData, earlObj));
			},

			put(earlObj) {
				if (!earlObj['@id']) {
					throw `Error: can not update EARL ${earlObj.type} without an ID.`;
				}
				return qwest.put(getUrlForEarl(apiUrl, earlObj),
								 signEarlData(userData, earlObj));
			},

			delete(earlObj) {
				if (!earlObj['@id']) {
					throw `Error: can not delete EARL ${earlObj.type} without an ID.`;
				}
				return qwest.delete(getUrlForEarl(apiUrl, earlObj),
								    signEarlData(userData, earlObj));
			},
		};

		return earlAdapter;
	}

	let earlApi = {
		connect(apiUrl, userkey) {
			return qwest.get(apiUrl +'/assertor', {
				'q[_privateKey]': userkey
			})
			.then(createAdapter.bind(null, apiUrl));
		}
	};

	return earlApi;
});