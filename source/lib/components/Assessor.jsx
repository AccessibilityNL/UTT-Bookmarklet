define(['React', './UttModule'],
function (React, UttModule) {

	let Assessor = React.createClass({
        render() {
            let q = this.props.question;
            return <UttModule>
                {q ? this.renderQuestion(q) : this.renderNoQuestion()}
            </UttModule>;
        },

        renderQuestion(q) {
            return <div>
                <p>Question {this.props.current} of {this.props.total}</p>
                <p>{q.text}</p>
                <p>{q.help}</p>
                {q.answers.map((answer, i) =>
                    <button key={i} onClick={this.props.sendResult.bind(null, answer.value)}>
                        {answer.text}
                    </button>
                )}
            </div>;
        },

        renderNoQuestion() {
            return <div>{this.props.locale.NO_QUESTION}</div>;
        }

	});
	return Assessor;

});