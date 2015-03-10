define(['React', 'UTT/components/questioner', './questiondata', 'UTT/utils/highlighter'],
function (React, QuestionerElm, questionData, highlighter) {

    let questioner = {
    	name:     'Questions',
    	subject:   null,
        component: null,
        questions: null,
        assertor:  null,

        init({userKey}) {
        	if (window) {
        		questioner.subject = window.location.href;
        	}
        	questioner.assertor = userKey;

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
        	let xhr = new XMLHttpRequest();   // new HttpRequest instance
        	let assert = questioner.createAssert(
	        		question.questionId,
	        		question.element,
	        		answer);

			xhr.open("POST", "/");
			xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			xhr.send(JSON.stringify(assert));

        	//console.log("Send: ", assert);
        },

        createAssert(test, elm, result) {
        	return {
        		subject: questioner.subject,
        		result: result,
        		mode: 'manual',
        		testcase: test,
        		pointer: elm.outerHTML.substr(0, 100),
        		assertedBy: questioner.assertor
        	};
        }
    };

    return questioner;
});