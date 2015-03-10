define(['React', 'UTT/utils/strFormat'],
function (React, strFormat) {
    let count = 0;

    let Questioner = React.createClass({
        answer: null,

        getInitialState() {
            return {
                error: false
            };
        },

        render() {
            let q = this.props.question;
            let error = '';

            if (this.state.error) {
                error = <p className="error">Please answer the question first.</p>;
            }

            return <div>
                {error}
                <p>{this.createQuestionText(q)}</p>
                <p>{q.help}</p>
                {q.answers.map(this.showAnswer)}
                <button onClick={this.answerQuestion}>Next question</button>
            </div>;
        },

        answerQuestion() {
            if (this.answer) {
                this.props.onAnswer(this.props.question, this.answer);
            } else {
                this.setState({error: true});
            }
        },

        createQuestionText(q) {
            return strFormat(q.text, ...q.variables.map((variable) => {
                let attr = q.element.getAttribute(variable);
                return attr;
            }));
        },

        showAnswer(answer) {
            count += 1;
            return <div key={'answer-' + count}>
                <input name="question" type="radio"
                    id={'answer-' + count}
                    value={answer.value}
                    onChange={this.handleChange} />
                <label htmlFor={'answer-' + count}> {answer.text}</label>
            </div>;
        },

        handleChange(event) {
            this.answer = event.target.value;
        },


    });

    return Questioner;
});