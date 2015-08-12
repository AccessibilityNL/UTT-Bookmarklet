define(['React', 'UTT/components/Assessor', 'UTT/main',
        './saveResult', 'autoWcag/testCase',
        'UTT/utils/highlighter',
        'UTT/modules/reporter/reporter'],
function (React, Assessor, UTT) {

    let saveResult     = require('UTT/modules/assessor/saveResult');
    let highlighter    = require('UTT/utils/highlighter');
    let testCase       = require('autoWcag/testCase');

    let reporter       = require('UTT/modules/reporter/reporter');
    console.log('TODO: report results');

    return function assertor({questions, category, icon}, i18n, render) {
        let renderQuestion = function (question) {
            let resolve;
            let reject;
            let p = new Promise(function (res, rej) {
                resolve = res;
                reject  = rej;
            });
            render(Assessor, {
                question: question,
                i18n: i18n,
                iconSrc: icon,
                sendResult(outcome) {
                    highlighter.removeHighlight();
                    resolve([question, outcome]);
                },
                exit() {
                    highlighter.removeHighlight();
                    reject();
                }
            });
            return p;
        };

        // Load the configuration of all questions
        testCase.requireConfig(questions)
        .then(function runTests(testConfigs) {
            // Loop over all test configurations
            return Promise.all(testConfigs.map((testConfig) => {

                // Run Run the selector.
                return testCase
                .runSelector(renderQuestion, testConfig, document)
                /**
                 * Run through the steps of a testCase, prompting the user
                 * whenever required, will resolve once an outcome is reach
                 */
                .then((elements) => {
                    console.log(elements);
                    let testReturns = elements.map(function (element) {
                        return testCase.runSteps(renderQuestion, testConfig, element);
                    });

                    testReturns.forEach((testReturn) => {
                        testReturn.then(saveResult);
                    });
                    return Promise.all(testReturns);
                });
            }));
        /**
         * Get all elements the testCase should be applied to
         * prompting the user wherever needed.
         */
        }).then(function (outcomes) {
            let metaResult = testCase.aggregate(outcomes);
            saveResult(metaResult);
            UTT.showHome();
        });

    };

});

