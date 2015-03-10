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

            this.setState({
                currentQuestion: this.state.currentQuestion + 1
            });
        },

        render() {
            let q = this.props.questions[this.state.currentQuestion];
            return (q ? this.renderQuestion(q) : this.renderDone());
        },

        renderQuestion(q) {
            return <div>
                Question {this.state.currentQuestion + 1} of {this.props.questions.length}
                <Question question={q} onAnswer={this.answerQuestion} />
            </div>;
        },

        renderDone() {
            return <div>Done!</div>;
        }

    });

    return Questioner;
});