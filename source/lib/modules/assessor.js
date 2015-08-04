define(['React', 'UTT/components/Assessor',
	'./assessor/buildQuestions', './assessor/saveResult',
	'UTT/utils/highlighter', './reporter/reporter'],
function (React, Assessor) {

	let buildQuestions = require('UTT/modules/assessor/buildQuestions');
	let saveResult     = require('UTT/modules/assessor/saveResult');
	let reporter     = require('UTT/modules/reporter/reporter');
	let highlighter    = require('UTT/utils/highlighter');

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
				let question  = questions[i];
				let highlight = highlighter.bind(null, question.element);
				highlight();

				render(Assessor, {
					question: question,
					i18n: i18n,
					current: i + 1,
					iconSrc: iconSrc,
					highlight: highlight,
					total: questions.length,
					sendResult(outcome) {
						highlighter.removeHighlight();
						config.completed = false;

						// Save the results on the server
						saveResult(questions[i], outcome)
						// Then give the results to the reporter module
						.then(reporter.addResult.bind(reporter, config.category));

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

