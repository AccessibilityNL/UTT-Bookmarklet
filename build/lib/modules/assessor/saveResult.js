"use strict";

define(["UTT/main", "UTT/earlTools/earlTools"], function (UTT) {

    var earlApi = require("UTT/earlTools/earlApi");
    var pages = require("UTT/earlTools/webpages");
    var evaluations = require("UTT/earlTools/evaluations");
    var assertions = require("UTT/earlTools/assertions");

    var webpage = undefined; // cached page
    var evaluation = undefined; // cached eval
    var auditResult = undefined; // cached audit results

    var logError = console.error.bind(console);
    var apiUrl = UTT.config.apiUrl;
    var userKey = UTT.userKey;

    var saveResult = function saveResult(question, outcome) {
        // First, get the connection, or open one if there isn't one yet
        earlApi.connect(apiUrl, userKey)

        // Get a webpage
        .then(function (_ref) {
            var earlAdapter = _ref.earlAdapter;

            // Check if the page is known
            if (webpage) {
                return { earlAdapter: earlAdapter, webpage: webpage };
            }

            // If not, create and send it to the server
            return earlAdapter.post(pages.createCurrent()).then(function (page) {
                webpage = page;
                return { earlAdapter: earlAdapter, webpage: webpage };
            });
        }).then(function (_ref) {
            var earlAdapter = _ref.earlAdapter;
            var webpage = _ref.webpage;

            var earlMsg = undefined;
            var promise = undefined;
            var assertion = assertions.createFromQuestion({
                webpage: webpage, question: question, outcome: outcome
            });

            if (!evaluation) {
                evaluation = evaluations.create();
                auditResult = evaluation.auditResult;
                auditResult.push(assertion);
                promise = earlAdapter.post(evaluation).then(function (response) {
                    delete response.assertions;
                    Object.assign(evaluation, response);
                    return evaluation;
                });
            } else {
                assertion.evaluation = evaluation["@id"];
                auditResult.push(assertion);
                promise = earlAdapter.post(assertion);
            }

            return promise;
        })["catch"](logError);
    };

    return saveResult;
});
//# sourceMappingURL=saveResult.js.map