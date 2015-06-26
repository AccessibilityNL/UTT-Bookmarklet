define(['./earlPointers'],
function (earlPointers) {
    const id   = '@id';
    const type = '@type';

    let assertions = {

        protoAssert: {
            [type]:    "Assertion",
            "subject":  undefined,
            "mode":     "earl:semiAuto",
            "test": {
                [id]:     undefined,
                [type]:   "TestRequirement"
            },
            "result": {
                [type]: "TestResult",
                "outcome": undefined,
                'pointer': undefined,
                // "isPartOf": {
                //     "@type": "TestRequirement",
                //     "@id": "wcag20:text-equiv-all"
                // }
            }
        },

        create(base = {}) {
            // Create separate test and result objects
            let test = Object.assign({},
                        assertions.protoAssert.test,
                        base.test);

            let result = Object.assign({},
                        assertions.protoAssert.result,
                        base.result);

            // Clone base and prototype to a new object
            let res = Object.assign({}, assertions.protoAssert,
                                 base, {test, result});
            if (res.subject && typeof res.subject[id] === 'string') {
                res.subject = res.subject[id];
            }
            return res;
        },

        createFromQuestion({webpage, question, outcome}) {
            let test = {
                [id]: question.id
            };
            let result = {
                outcome: 'earl:' + outcome,
                pointer: earlPointers.createPointer(question.element)
            };

            return assertions.create({
                test,
                result,
                subject: webpage
            });
        }
    };

    return assertions;
});