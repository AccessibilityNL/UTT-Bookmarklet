define(['UTT/utils/strFormat', 'UTT/utils/highlighter'],
function (strFormat, highlighter) {

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

    function createQuestionText(q) {
        return strFormat(q.text, ...q.variables.map((variable) => {
            let value;
            let elm = q.element;
            if (variable === 'text') {
                value = elm.textContent || elm.innerText;
            } else {
                value = elm.getAttribute(variable);
            }
            return value;
        }));
    }

	function buildQuestions(questionData) {
        return Object.keys(questionData.questions)
        .reduce((questions, questionId) => {
            let question = questionData.questions[questionId];
            let nodes = highlighter.find(question.selector.css);
            nodes = Array.prototype.slice.call(nodes);
            let bookmarklet = highlighter.find('#utt-bookmarklet-container')[0];

            let elms = nodes.filter((elm) => !isDecending(bookmarklet, elm) );

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
                    id: questionId,
                }, question)
            ));

            questions.forEach((question) => {
            	question.text = createQuestionText(question);
            });

            return questions;
        }, []);
    }

    return buildQuestions;
});
