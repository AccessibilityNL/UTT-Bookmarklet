"use strict";

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

define(["./earlPointers"], function (earlPointers) {
    var id = "@id";
    var type = "@type";

    var assertions = {

        protoAssert: (function () {
            var _protoAssert = {};

            _defineProperty(_protoAssert, type, "Assertion");

            _defineProperty(_protoAssert, "subject", undefined);

            _defineProperty(_protoAssert, "mode", "earl:semiAuto");

            _defineProperty(_protoAssert, "test", (function () {
                var _defineProperty2 = {};

                _defineProperty(_defineProperty2, id, undefined);

                _defineProperty(_defineProperty2, type, "TestRequirement");

                return _defineProperty2;
            })());

            _defineProperty(_protoAssert, "result", (function () {
                var _defineProperty3 = {};

                _defineProperty(_defineProperty3, type, "TestResult");

                _defineProperty(_defineProperty3, "outcome", undefined);

                _defineProperty(_defineProperty3, "pointer", undefined);

                return _defineProperty3;
            })());

            return _protoAssert;
        })(),

        create: function create() {
            var base = arguments[0] === undefined ? {} : arguments[0];

            // Create separate test and result objects
            var test = Object.assign({}, assertions.protoAssert.test, base.test);

            var result = Object.assign({}, assertions.protoAssert.result, base.result);

            // Clone base and prototype to a new object
            var res = Object.assign({}, assertions.protoAssert, base, { test: test, result: result });
            if (res.subject && typeof res.subject[id] === "string") {
                res.subject = res.subject[id];
            }
            return res;
        },

        createFromQuestion: function createFromQuestion(_ref) {
            var webpage = _ref.webpage;
            var question = _ref.question;
            var outcome = _ref.outcome;

            var test = _defineProperty({}, id, question.id);
            var result = {
                outcome: "earl:" + outcome,
                pointer: earlPointers.createPointer(question.element)
            };

            return assertions.create({
                test: test,
                result: result,
                subject: webpage
            });
        }
    };

    return assertions;
});

// "isPartOf": {
//     "@type": "TestRequirement",
//     "@id": "wcag20:text-equiv-all"
// }
//# sourceMappingURL=assertions.js.map