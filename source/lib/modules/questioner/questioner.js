define(['React', 'UTT/components/questioner', './questiondata', 'UTT/utils/highlighter'],
function (React, QuestionerElm, questionData, highlighter) {

    let questioner = {
    	name: 'Questions',
        component: null,
        questions: null,

        init() {
			questioner.questions = questioner.buildQuestions(questionData);
			questioner.component = React.createElement(QuestionerElm, {
				questions: questioner.questions,
				onAnswer: questioner.onAnswer
			});
        },

        buildQuestions(questionData) {
        	return Object.keys(questionData.questions)
			.reduce((questions, questionId) => {
				let question = questionData.questions[questionId];
				let elms = highlighter.find(question.selector.css);
				if (!elms) {
					return questions;
				}
				// use an array instead of a nodeList
				elms = Array.prototype.slice.call(elms);

				// Apply question limit
				if (typeof question.limit === 'number') {
					elms.splice(question.limit);
				}
				// For each element, create q question and push it on the questions array
				questions.push(...elms.map((element) =>
					Object.assign({
						element, questionId
					}, question)
				));
				return questions;
			}, []);
        },

        onAnswer(question, answer) {
        	console.log(question.questionId, question.element, answer);
        }
    };
    return questioner;
});