"use strict";

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

define(["React", "UTT/components/questioner", "./questiondata", "UTT/utils/highlighter", "UTT/utils/assertion"], function (React, QuestionerElm, questionData, highlighter, assertion) {

    function isDecending(parent, child) {
        var node = child.parentNode;
        while (node !== null) {
            if (node === parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    var questioner = {
        name: "Questions",
        component: null,
        questions: null,
        userKey: null,
        url: null,
        subject: null,

        init: function init(_ref) {
            var userKey = _ref.userKey;
            var url = _ref.url;

            // Setup defaults
            Object.assign(questioner, {
                userKey: userKey, url: url,
                questions: questioner.buildQuestions(questionData)
            });

            if (window) {
                questioner.subject = window.location.href;
            }
            questioner.component = React.createElement(QuestionerElm, {
                questions: questioner.questions,
                onAnswer: questioner.onAnswer
            });
        },

        buildQuestions: function buildQuestions(questionData) {
            return Object.keys(questionData.questions).reduce(function (questions, questionId) {
                var question = questionData.questions[questionId];
                var nodes = highlighter.find(question.selector.css);
                nodes = Array.prototype.slice.call(nodes);
                var bookmarklet = highlighter.find("#utt-bookmarklet-container")[0];

                var elms = nodes.reduce(function (elms, elm) {
                    if (!isDecending(bookmarklet, elm)) {

                        elms.push(elm);
                    }
                    return elms;
                }, []);

                if (!elms) {
                    return questions;
                }
                // use an array instead of a nodeList

                // Apply question limit
                if (typeof question.limit === "number") {
                    elms.splice(question.limit);
                }
                // For each element, create q question and push it on the questions array
                questions.push.apply(questions, _toConsumableArray(elms.map(function (element) {
                    return Object.assign({
                        element: element,
                        id: questionId
                    }, question);
                })));
                return questions;
            }, []);
        },

        onAnswer: function onAnswer(_ref, outcome) {
            var id = _ref.id;
            var element = _ref.element;

            var xhr = new XMLHttpRequest(); // new HttpRequest instance
            var target = questionData.postUrl || questioner.url + "assertions";
            var userKey = questioner.userKey;
            var url = questioner.url;
            var subject = questioner.subject;

            var assert = assertion.create({
                element: element, outcome: outcome, userKey: userKey, url: url, subject: subject,
                testcase: id });

            xhr.open("PUT", target);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify(assert));
        }
    };

    return questioner;
});
//# sourceMappingURL=questioner.js.map