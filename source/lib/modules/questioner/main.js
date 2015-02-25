define(['UTT/components/questioner', './questions'],
function (QuestionerElm, questions) {

    let questioner = {
        component: QuestionerElm,
        init() {
            console.log(questions);
        }
    };
    return questioner;
});