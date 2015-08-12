define(['autoWcag/testCaseBuilder'],
       function (builder) {

    let testCase = {
        requireConfig(tests) {
            let resolve;
            let p = new Promise((r) => { resolve = r; });

            require(tests, function (...testCases) {
                resolve(testCases);
            });
            return p;
        },

        runSelector(promptUser, testConfig, root) {
            let selector = builder.createSelectorFunc(testConfig.selector);
            return Promise.resolve(selector(root, promptUser));
        },

        runSteps(promptUser, testConfig, element, currStep) {
            // Initial step
            if (!currStep) {
                currStep = testConfig.steps.find((step) => step.start);
            }
            console.log(currStep);

            // Turn the current step into a promise
            let currStepFunc = builder.createStepFunc(currStep);
            return currStepFunc(element, promptUser)
            .then((result) => {
                // Either return the value
                if (result.type === 'returnEarl') {
                    return result.value;

                // Or go to another step
                } else if (result.type === 'changeStep') {
                    // Find the next step
                    let nextStep = testConfig.steps
                    .find((step) => step.name === result.value);

                    // And run it:
                    testCase.runSteps(promptUser, testConfig,
                                      element, nextStep);

                } else {
                    throw "Invalid result for " + testConfig.id;
                }
            });
        },

        aggregate(outcomes) {
            // look at the hasPart and return results
            // based on that
            return [];
        }
    };

    return testCase;
});