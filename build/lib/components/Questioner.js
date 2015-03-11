"use strict";

define(["React", "./Question"], function (React, Question) {

    var Questioner = React.createClass({ displayName: "Questioner",
        getInitialState: function getInitialState() {
            return {
                currentQuestion: 0
            };
        },

        answerQuestion: function answerQuestion(question, answer) {
            if (this.props.onAnswer) {
                this.props.onAnswer(question, answer);
            }

            this.setState({
                currentQuestion: this.state.currentQuestion + 1
            });
        },

        render: function render() {
            var q = this.props.questions[this.state.currentQuestion];
            return q ? this.renderQuestion(q) : this.renderDone();
        },

        renderQuestion: function renderQuestion(q) {
            return React.createElement("div", null, "Question ", this.state.currentQuestion + 1, " of ", this.props.questions.length, React.createElement(Question, { question: q, onAnswer: this.answerQuestion }));
        },

        renderDone: function renderDone() {
            return React.createElement("div", null, "Done!");
        }

    });

    return Questioner;
});
//# sourceMappingURL=Questioner.js.map