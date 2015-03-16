define(['React', './Question'],
function (React, Question) {

    let Questioner = React.createClass({
        getInitialState() {
            return {
                currentQuestion: 0
            };
        },

        answerQuestion(question, answer) {
            if (this.props.onAnswer) {
                this.props.onAnswer(question, answer);
            }
        },

        render() {
            let showQuestion = +this.props.showQuestion;
            let q = this.props.questions[showQuestion];
            if (this.props.questions.length === 0) {
                return this.renderNoQuestions();
            } else if (q) {
                return this.renderQuestion(q);
            } else {
                return this.renderDone();
            }
        },

        renderQuestion(q) {
            return <div>
                Question {this.props.showQuestion + 1} of {this.props.questions.length}
                <Question question={q} onAnswer={this.answerQuestion} />
            </div>;
        },

        renderNoQuestions() {
            return <div>No questions</div>;
        },

        renderDone() {
            return <div>Done!</div>;
        }

    });

    return Questioner;
});