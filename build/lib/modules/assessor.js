"use strict";

define(["React", "UTT/components/Assessor", "./assessor/buildQuestions", "./assessor/saveResult", "UTT/utils/highlighter"], function (React, Assessor) {

	var buildQuestions = require("UTT/modules/assessor/buildQuestions");
	var saveResult = require("UTT/modules/assessor/saveResult");
	var highlighter = require("UTT/utils/highlighter");

	return function assertor(config, i18n, render) {
		var questions = config.questions;
		var category = config.category;
		var icon = config.icon;

		require([questions, "UTT/main"], function (qData, UTT) {
			var questions = qData[category];
			var iconSrc = require.toUrl("UTT/components/assets/images/" + icon);

			if (!questions) {
				return;
			}
			questions = buildQuestions(questions);

			var showQuestion = (function (_showQuestion) {
				var _showQuestionWrapper = function showQuestion(_x) {
					return _showQuestion.apply(this, arguments);
				};

				_showQuestionWrapper.toString = function () {
					return _showQuestion.toString();
				};

				return _showQuestionWrapper;
			})(function (i) {
				var question = questions[i];
				var highlight = highlighter.bind(null, question.element);
				highlight();

				render(Assessor, {
					question: question,
					i18n: i18n,
					current: i + 1,
					iconSrc: iconSrc,
					highlight: highlight,
					total: questions.length,
					sendResult: function sendResult(outcome) {
						highlighter.removeHighlight();
						config.completed = false;
						saveResult(questions[i], outcome);
						if (questions[i + 1]) {
							showQuestion(i + 1);
						} else {
							config.completed = true;
							UTT.showHome();
						}
					}
				});
			});
			showQuestion(0);
		});
	};
});
//# sourceMappingURL=assessor.js.map