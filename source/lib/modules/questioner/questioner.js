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

        onAnswer({id, element}, answer) {
            let xhr = new XMLHttpRequest();   // new HttpRequest instance
            let assert = questioner.createAssert(id, element, answer);

            xhr.open("POST", "/");
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify(assert));
        },

        createAssert(test, elm, outcome) {
            return {
                subject: questioner.subject,
                result: {
                    outcome: outcome,
                    pointer: {
                        charSnippet: elm.outerHTML.substr(0, 100),
                    }
                },
                mode: 'manual',
                testcase: test,
                assertedBy: questioner.assertor
            };
        }

    };

    return questioner;
});