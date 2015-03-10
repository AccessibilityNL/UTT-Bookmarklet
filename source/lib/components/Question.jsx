define(['React', 'UTT/utils/strFormat'],
function (React, strFormat) {
    let count = 0;

    let Questioner = React.createClass({

        render() {
            let q = this.props.question;
            return <div>
                <div>{this.createQuestionText(q)}</div>
                <div>{q.help}</div>
                {q.answers.map(this.showAnswer)}
                <button onClick={this.nextQuestion}>Next question</button>
            </div>;
        },

        nextQuestion() {
            // TODO: Check if an answer was set

            this.props.onNext();
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
                <input name="question" type="radio" id={'answer-' + count} />
                <label htmlFor={'answer-' + count}> {answer.text}</label>
            </div>;
        }


    });

    return Questioner;
});