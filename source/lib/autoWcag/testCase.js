define(['autoWcag/testCaseBuilder'],
       function (builder) {

    let testCase = {
        requireConfig(tests) {
            let resolve;
            let p = new Promise((r) => {
                resolve = r;
            });

            // require(tests.map((test) => `autoWcag/testCases/${test}`),
            //         function (...testCases) {
            //     resolve(testCases);
            // });
            return p;
        },

        runSelector(promptUser, test, root) {
            let selector = builder.createSelector(test);
            return Promise.resolve(selector(root, promptUser));
        },

        runSteps(promptUser, testConfig, element) {

        }

    };

    return testCase;
});