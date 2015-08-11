define(['React', 'UTT/components/Assessor',
        './saveResult', 'autoWcag/testCase',
        'UTT/utils/highlighter',
        'UTT/modules/reporter/reporter'],
function (React, Assessor) {

    let saveResult     = require('UTT/modules/assessor/saveResult');
    let reporter       = require('UTT/modules/reporter/reporter');
    let highlighter    = require('UTT/utils/highlighter');
    let testCase       = require('autoWcag/testCase');
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


        testCase.requireConfig(questions)
        .then(function runTests(testConfig) {
            let p = testCase.runSelector(renderQuestion, testConfig, document)
            /**
             * Run through the steps of a testCase, prompting the user
             * whenever required, will resolve once an outcome is reach
             */
            .then((elements) => {
                let testReturns = elements.map(function (element) {
                    return testCase.runSteps(renderQuestion, testConfig, element);
                });

                testReturns.forEach((testReturn) => {
                    testReturn.then(saveResult);
                });
                return Promise.all(testReturns);
            });
            return p;
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

