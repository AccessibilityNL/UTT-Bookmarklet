define(['React', 'UTT/components/Assessor',
	'./assessor/buildQuestions', './assessor/saveResult'],
function (React, Assessor) {

	let buildQuestions = require('UTT/modules/assessor/buildQuestions');
	let saveResult     = require('UTT/modules/assessor/saveResult');

	return function assertor(config, i18n, render) {
		let {questions, category, icon} = config;

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
					sendResult(outcome) {
						config.completed = false;
						saveResult(questions[i], outcome);
						if (questions[i+1]) {
							showQuestion(i+1);
						} else {
							config.completed = true;
							UTT.showHome();
						}

					}
				});
			};
			showQuestion(0);

		});

	};

});

