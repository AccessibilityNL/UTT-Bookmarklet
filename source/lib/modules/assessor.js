define(['React', 'UTT/components/Assessor',
	'./assessor/buildQuestions'],
function (React, Assessor, buildQuestions) {

	return function assertor({questions, category}, locale, render) {

		require([questions], (qData) => {
			let questions = qData[category];
			if (!questions) {
				return;
			}
			console.log(questions);
			questions = buildQuestions(questions);

			console.log(questions);

			render(Assessor, {
				question: questions[0],
				locale: locale,
				sendResult(result) {
					console.log('next, result = ' + result);
				}
			});
		});

	};

});

