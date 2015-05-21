define(['React', './UttModule'],
function (React, UttModule) {


	let Assessor = React.createClass({
        sendAnswer(answer) {
            this.props.sendResult(answer);
        },
		render() {
            let q = this.props.question;
            console.log(q);

            return <UttModule>
                <p>{q.text}</p>
                <p>{q.help}</p>
                {q.answers.map((answer) =>
                    <button onClick={this.sendAnswer.bind(this, answer.value)}>
                        {answer.text}
                    </button>
                )}
            </UttModule>;
		}
	});
	return Assessor;

});