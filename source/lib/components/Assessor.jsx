define(['React', './UttModule', 'UTT/utils/strFormat'],
function (React, UttModule, strFormat) {

    function createQuestionText(q) {
        return strFormat(q.text, ...q.variables.map((variable) => {
            let value;
            let elm = q.element;
            if (variable === 'text') {
                value = elm.textContent || elm.innerText;
            } else {
                value = elm.getAttribute(variable);
            }
            return value;
        }));
    }

	let Assessor = React.createClass({
		render() {
            // let q = this.props.question;
            let q = "Some question";
            return <UttModule>
                <p>{createQuestionText(q)}</p>
                <p>{q.help}</p>
                <button onClick={this.answerYes}>Yes</button>
                <button onClick={this.answerNo}>No</button>
                <button onClick={this.answerUnknown}>Don't know</button>
            </UttModule>;
		}
	});
	return Assessor;

});