define(['React', 'UTT/components/Assessor', './questioner/questiondata',
	'./questioner/buildQuestions'],
function (React, Assessor, questiondata, buildQuestions) {

	return function assertor(config, locale) {
		let questions = buildQuestions(questiondata);

		return React.createElement(Assessor, {
			question: questions[0],
			sendResult(result) {
				console.log('next, result = ' + result);
			}
		});

	};

});

