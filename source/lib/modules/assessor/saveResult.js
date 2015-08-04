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

                UTT.data.webpage = webpage;
                return {earlAdapter, webpage};
            });

        }).then(function ({earlAdapter, webpage}) {
            let promise;
            let assertion = assertions.createFromQuestion({
                webpage, question, outcome
            });

            if (!evaluation) {
                evaluation  = evaluations.create();
                auditResult = evaluation.auditResult;
                auditResult.push(assertion);
                promise = earlAdapter.post(evaluation)
                .then(function (response) {
                    delete response.assertions;
                    Object.assign(evaluation, response);

                    // Set evaluation as UTT data
                    UTT.data.evaluation = evaluation;
                    UTT.data.evaluation.auditResult[0] = assertion;

                    return evaluation;
                });

            } else {
                assertion.evaluation = evaluation['@id'];
                auditResult.push(assertion);
                promise = earlAdapter.post(assertion)
                .then(function (response) {
                    // Add assertion to evaluation data
                    UTT.data.evaluation.auditResult.push(response);

                    return response;
                });
            }

            return promise;

        }).catch(logError);

    };

    return saveResult;

});