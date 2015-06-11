"use strict";

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

define(["UTT/utils/strFormat", "UTT/utils/highlighter"], function (strFormat, highlighter) {

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

    function createQuestionText(q) {
        return strFormat.apply(undefined, [q.text].concat(_toConsumableArray(q.variables.map(function (variable) {
            var value = undefined;
            var elm = q.element;
            if (variable === "text") {
                value = elm.textContent || elm.innerText;
            } else {
                value = elm.getAttribute(variable);
            }
            return value;
        }))));
    }

    function buildQuestions(questionData) {
        return Object.keys(questionData).reduce(function (questions, questionId) {
            var question = questionData[questionId];
            var nodes = highlighter.find(question.selector.css);

            console.log(question);

            nodes = Array.prototype.slice.call(nodes);
            var bookmarklet = highlighter.find("#utt-bookmarklet-container")[0];

            var elms = nodes.filter(function (elm) {
                return !isDecending(bookmarklet, elm);
            });

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
                    id: questionId }, question);
            })));

            questions.forEach(function (question) {
                question.text = createQuestionText(question);
            });
            console.log(questions.length);
            return questions;
        }, []);
    }

    return buildQuestions;
});
//# sourceMappingURL=buildQuestions.js.map