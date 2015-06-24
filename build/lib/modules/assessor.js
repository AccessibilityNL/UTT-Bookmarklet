"use strict";

define(["React", "UTT/components/Assessor", "./assessor/buildQuestions", "UTT/earlTools/earlStore"], function (React, Assessor) {

	var buildQuestions = require("UTT/modules/assessor/buildQuestions");
	var earlStore = require("UTT/earlTools/earlStore");

	var saveResult = function saveResult(question, result) {
		var assertion = earlStore.buildAssertion(question, result);
		earlStore.addAssertion(assertion);
	};

	return function assertor(_ref, i18n, render) {
		var questions = _ref.questions;
		var category = _ref.category;
		var icon = _ref.icon;

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
				render(Assessor, {
					question: questions[i],
					i18n: i18n,
					current: i + 1,
					iconSrc: iconSrc,
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