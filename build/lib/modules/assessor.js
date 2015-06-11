"use strict";

define(["React", "UTT/components/Assessor", "./assessor/buildQuestions"], function (React, Assessor, buildQuestions) {

	var saveResult = function saveResult(question, result) {
		console.log(result);
	};

	return function assertor(_ref, locale, render) {
		var questions = _ref.questions;
		var category = _ref.category;

		require([questions, "UTT/main"], function (qData, UTT) {
			var questions = qData[category];
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
				render(Assessor, {
					question: questions[i],
					locale: locale,
					current: i + 1,
					total: questions.length,
					sendResult: function sendResult(result) {
						saveResult(questions[i], result);
						if (questions[i + 1]) {
							showQuestion(i + 1);
						} else {
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