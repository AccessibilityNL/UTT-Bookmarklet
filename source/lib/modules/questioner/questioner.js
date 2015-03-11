define(['React', 'UTT/components/Questioner', './questiondata',
        'UTT/utils/highlighter', 'UTT/utils/assertion'],
function (React, QuestionerElm, questionData, highlighter, assertion) {

    function isDecending(parent, child) {
        let node = child.parentNode;
        while (node !== null) {
            if (node === parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }


    let questioner = {
        name:     'Questions',
        component: null,
        questions: null,
        userKey:   null,
        url:       null,
        subject:   null,

        init({userKey, url}) {
            // Setup defaults
            Object.assign(questioner, {
                userKey, url,
                questions: questioner.buildQuestions(questionData)
            });

            if (window) {
                questioner.subject = window.location.href;
            }
            questioner.component = React.createElement(QuestionerElm, {
                questions: questioner.questions,
                onAnswer: questioner.onAnswer
            });
        },

        buildQuestions(questionData) {
            return Object.keys(questionData.questions)
            .reduce((questions, questionId) => {
                let question = questionData.questions[questionId];
                let nodes = highlighter.find(question.selector.css);
                nodes = Array.prototype.slice.call(nodes);
                let bookmarklet = highlighter.find('#utt-bookmarklet-container')[0];

                let elms = nodes.reduce((elms, elm) => {
                    if (!isDecending(bookmarklet, elm)) {

                        elms.push(elm);
                    }
                    return elms;
                }, []);

                if (!elms) {
                    return questions;
                }
                // use an array instead of a nodeList

                // Apply question limit
                if (typeof question.limit === 'number') {
                    elms.splice(question.limit);
                }
                // For each element, create q question and push it on the questions array
                questions.push(...elms.map((element) =>
                    Object.assign({
                        element,
                        id: questionId
                    }, question)
                ));
                return questions;
            }, []);
        },

        onAnswer({id, element}, outcome) {
            let xhr    = new XMLHttpRequest();   // new HttpRequest instance
            let target = questionData.postUrl || (questioner.url + 'assertions');
            let {userKey, url, subject} = questioner;

            let assert = assertion.create({
                element, outcome, userKey, url, subject,
                testcase: id,
            });

            xhr.open("PUT", target);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify(assert));
        }
    };

    return questioner;
});