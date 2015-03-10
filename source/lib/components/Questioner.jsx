define(['React', './Question'],
function (React, Question) {

    let Questioner = React.createClass({
        getInitialState() {
            return {
                currentQuestion: 0
            };
        },

        nextQuestion() {
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
                <Question question={q} onNext={this.nextQuestion} />
            </div>;
        },

        renderDone() {
            return <div>Done!</div>;
        }

    });

    return Questioner;
});