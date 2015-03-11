"use strict";

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

define(["React", "UTT/utils/strFormat"], function (React, strFormat) {
    var count = 0;

    var Questioner = React.createClass({ displayName: "Questioner",
        answer: null,

        getInitialState: function getInitialState() {
            return {
                error: false
            };
        },

        render: function render() {
            var q = this.props.question;
            var error = "";

            if (this.state.error) {
                error = React.createElement("p", { className: "error" }, "Please answer the question first.");
            }

            return React.createElement("div", null, error, React.createElement("p", null, this.createQuestionText(q)), React.createElement("p", null, q.help), q.answers.map(this.showAnswer), React.createElement("button", { onClick: this.answerQuestion }, "Next question"));
        },

        answerQuestion: function answerQuestion() {
            if (this.answer) {
                this.props.onAnswer(this.props.question, this.answer);
            } else {
                this.setState({ error: true });
            }
        },

        createQuestionText: function createQuestionText(q) {
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
        },

        showAnswer: function showAnswer(answer) {
            count += 1;
            return React.createElement("div", { key: "answer-" + count }, React.createElement("input", { name: "question", type: "radio",
                id: "answer-" + count,
                value: answer.value,
                onChange: this.handleChange }), React.createElement("label", { htmlFor: "answer-" + count }, " ", answer.text));
        },

        handleChange: function handleChange(event) {
            this.answer = event.target.value;
        } });

    return Questioner;
});
//# sourceMappingURL=Question.js.map