define(['qwest'],
function (qwest) {
    const knownTypes = {
        'Assertor':   'assertors',
        'evaluation': 'evaluations',
        'webpage':    'webpages',
        'Assertion':  'assertions'
    };

    const type       = '@type';
    const id         = '@id';
    const userKeys   = {
        evaluation: 'creator',
        Assertion: 'assertedBy'
    };
    const connections = {};
    const opt = {
        dataType: 'json'
    };

    function wrapQwest(qPromise) {
        return new Promise((resolve, fail) =>
                    qPromise.then(resolve).catch(fail));
    }

    /**
     * [getUrlForEarl description]
     * @param  {[type]} apiUrl  [description]
     * @param  {[type]} earlObj [description]
     * @return {[type]}         [description]
     */
    function getUrlForEarl(apiUrl, earlObj) {
        let objId   = '';
        let objType = earlObj[type];
        if (!knownTypes[objType]) {
            throw 'Unknown EARL type ' + earlObj.type;
        }

        if (typeof earlObj[id] === 'string') {
            objId = '/' + earlObj[id];
        }
        return apiUrl + '/' + knownTypes[objType] + objId;
    }


    /**
     * Create a copy of the object, with all required properties
     *
     * Post/Put requires a signed user for evaluations and assertions
     * The @context is also added.
     * @param  {String} apiUrl
     * @param  {Object} userData
     * @param  {Object} earlObj  Object to sign
     * @return {Object}          Copy of the object with signed values
     */
    function prepEarlData(apiUrl, userData, earlObj) {
        const objType = earlObj[type];
        let   base    = {};

        if (!earlObj['@context']) {
            base['@context'] = apiUrl + '/contexts/' +
                               objType + '.jsonld';
        }
        if (userKeys[objType]) {
            base[userKeys[objType]] = userData;
        }
        return Object.assign(base, earlObj);
    }


    function createAdapter(apiUrl, userData) {
        // Bind with static values
        let prepEarl = prepEarlData.bind(null, apiUrl, userData);
        let getUrl   = getUrlForEarl.bind(null, apiUrl);

        /**
         * Once connected, the adapter allows RESTful access
         * to the EARL API, with .post(), .get(), .put(), .delete()
         * @type {Object}
         */
        let earlAdapter = {
            /**
             * Create an EARL object at the server
             * @param  {object} earlObj Any type of EARL object
             * @return {Promise}        Once done, returns the object as stored on the server
             */
            post(earlObj) {
                if (earlObj['@id']) {
                    throw `Error: can not create EARL ${earlObj[type]} with an existing ID (${earlObj['@id']}).`;
                }
                return wrapQwest(
                    qwest.post(getUrl(earlObj), prepEarl(earlObj), opt)
                );
            },

            /**
             * Get the data of an EARL object
             * @param  {object} earlObj Any type of EARL object
             * @return {Promise}        Once done, returns the object as stored on the server
             */
            get(earlObj) {
                if (!earlObj['@id']) {
                    throw `Error: can not get EARL ${earlObj[type]} without a ID.`;
                }
                return wrapQwest(
                    qwest.get(getUrl(earlObj), prepEarl(earlObj), opt)
                );
            },

            /**
             * Update an EARL object at the server
             * @param  {object} earlObj Any type of EARL object
             * @return {Promise}        Once done, returns the object as stored on the server
             */
            put(earlObj) {
                if (!earlObj['@id']) {
                    throw `Error: can not update EARL ${earlObj[type]} without an ID.`;
                }
                return wrapQwest(
                    qwest.put(getUrl(earlObj), prepEarl(earlObj), opt)
                );
            },

            /**
             * Delete an EARL object from the server
             * @param  {object} earlObj Any type of EARL object
             * @return {Promise}        Once done, returns a boolean indicating success
             */
            delete(earlObj) {
                if (!earlObj['@id']) {
                    throw `Error: can not delete EARL ${earlObj[type]} without an ID.`;
                }
                return wrapQwest(
                    qwest.delete(getUrl(earlObj), prepEarl(earlObj), opt)
                );
            },
        };

        return earlAdapter;
    }

    /**
     * Contains a single 'connect' which once connected returns the
     * adapter
     * @type {Object}
     */
    let earlApi = {
        /**
         * Connect to an EARL API
         * @param  {string} apiUrl
         * @param  {string} userkey
         * @return {Promise}         Which returns the adapter once done
         */
        connect(apiUrl, userkey) {
            if (connections[apiUrl]) {
                return new Promise((resolve) => {
                    resolve({ earlAdapter: connections[apiUrl] });
                });
            }

            return wrapQwest(qwest.get(apiUrl +'/assertors', {
                // 'q[_privateKey]': userkey
                'q': userkey

            })).then(function (userData) {
                // TODO: This should not be required for a real JSON-LD call
                userData['@id'] = 'utt:assertors' +
                                userData['@id'].split('assertors')[1];

                userData['utt:_privateKey'] = userkey;
                connections[apiUrl] = createAdapter(apiUrl, userData);
                return { earlAdapter: connections[apiUrl] };
            });
        }
    };

    return earlApi;
});