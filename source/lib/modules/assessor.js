define(['React', 'UTT/components/Assessor',
	'./assessor/buildQuestions'],
function (React, Assessor, buildQuestions) {

	let saveResult = function (question, result) {
		console.log(result);
	};

	return function assertor({questions, category}, i18n, render) {
		require([questions, 'UTT/main'], (qData, UTT) => {
			let questions = qData[category];
			if (!questions) {
				return;
			}
			questions = buildQuestions(questions);

			let showQuestion = function (i) {
				render(Assessor, {
					question: questions[i],
					i18n: i18n,
					current: i + 1,
					total: questions.length,
					sendResult(result) {
						saveResult(questions[i], result);
						if (questions[i+1]) {
							showQuestion(i+1);
						} else {
							UTT.showHome();
						}

					}
				});
			};
			showQuestion(0);

		});

	};

});

