define(['UTT/main', 'UTT/earlTools/earlTools'],
function (UTT) {

    let earlApi     = require('UTT/earlTools/earlApi');
    let pages       = require('UTT/earlTools/webpages');
    let evaluations = require('UTT/earlTools/evaluations');
    let assertions  = require('UTT/earlTools/assertions');

    let webpage;     // cached page
    let evaluation;  // cached eval
    let auditResult; // cached audit results

    let logError = console.error.bind(console);
    let apiUrl   = UTT.config.apiUrl;
    let userKey  = UTT.userKey;

    let saveResult = function (question, outcome) {
        // First, get the connection, or open one if there isn't one yet
        return earlApi.connect(apiUrl, userKey)

        // Get a webpage
        .then(function ({earlAdapter}) {
            // Check if the page is known
            if (webpage) {
                return {earlAdapter, webpage};
            }

            // If not, create and send it to the server
            return earlAdapter.post(pages.createCurrent())
            .then((page) => {
                webpage = page;
                return {earlAdapter, webpage};
            });

        }).then(function ({earlAdapter, webpage}) {
            let promise;
            let assertion = assertions.createFromQuestion({
                webpage, question, outcome
            });

            // Create an evaluation if one isn't already there
            // and include the assertion within this save
            if (!evaluation) {
                evaluation  = evaluations.create();
                auditResult = evaluation.auditResult;
                auditResult.push(assertion);
                promise = earlAdapter.post(evaluation)
                .then(function (response) {
                    delete response.assertions;
                    Object.assign(evaluation, response);
                    return evaluation;
                });

            // Save the assertion and associate it with the
            // current evaluation
            } else {
                assertion.evaluation = evaluation['@id'];
                auditResult.push(assertion);
                promise = earlAdapter.post(assertion);
            }

            // Finally, return the assertion
            return promise.then(function () {
                return assertion;
            });

        }).catch(logError);

    };

    return saveResult;

});