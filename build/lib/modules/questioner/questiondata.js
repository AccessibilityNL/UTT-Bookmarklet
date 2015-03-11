"use strict";

define({
    // postUrl: '' // (optionsal) Path to which the data should be posted
    questions: {
        "auto-wcag:1.1.1-img-alt": {
            selector: { css: "img[alt]" },
            variables: ["alt"],
            text: "Is \"{0}\" a good description for this image?",
            help: "",
            limit: 10,
            answers: [{ value: "passed", text: "yes" }, { value: "failed", text: "no" }, { value: "cantTell", text: "Unclear" }]
        },

        "auto-wcag:2-4-2-title": {
            selector: { css: "title" },
            variables: ["text"],
            text: "Is \"{0}\" a good description for this page?",
            help: "",
            limit: 1,
            answers: [{ value: "passed", text: "yes" }, { value: "failed", text: "no" }, { value: "cantTell", text: "Unclear" }]
        }
    }
});
//# sourceMappingURL=questiondata.js.map