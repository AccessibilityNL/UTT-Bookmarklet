define(['React', 'UTT/components/Assessor',
	'./assessor/buildQuestions', 'UTT/earlTools/earlStore'],
function (React, Assessor) {

	let buildQuestions = require('UTT/modules/assessor/buildQuestions');
	let earlStore      = require('UTT/earlTools/earlStore');

	let saveResult = function (question, result) {
		let assertion = earlStore.buildAssertion(question, result);
		earlStore.addAssertion(assertion);
	};

	return function assertor({questions, category, icon}, i18n, render) {
		require([questions, 'UTT/main'], (qData, UTT) => {
			let questions = qData[category];
			let iconSrc = require.toUrl(
				'UTT/components/assets/images/' + icon);

			if (!questions) {
				return;
			}
			questions = buildQuestions(questions);

			let showQuestion = function (i) {
				render(Assessor, {
					question: questions[i],
					i18n: i18n,
					current: i + 1,
					iconSrc: iconSrc,
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

