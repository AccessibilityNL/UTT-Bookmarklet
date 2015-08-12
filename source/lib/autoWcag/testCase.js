define(['autoWcag/testCaseBuilder'],
       function (builder) {

    let testCase = {
        requireConfig(tests) {
            let resolve;
            let p = new Promise((r) => { resolve = r; });

            require(tests, function (...testCases) {
                console.log(testCases);
                resolve(testCases);
            });
            return p;
        },

        runSelector(promptUser, test, root) {
            let selector = builder.createSelector(test.selector);
            console.log(selector);
            return Promise.resolve(selector(root, promptUser));
        },

        runSteps(promptUser, testConfig, element) {

        },

        aggregate(outcomes) {
            // look at the hasPart and return results
            // based on that
            return [];
        }
    };

    return testCase;
});