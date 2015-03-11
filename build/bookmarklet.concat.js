"use strict";

(function () {

    var scriptSrc = document.getElementById("utt-bookmarklet").src;
    var rootPath = scriptSrc.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)[0];
    var userKey = (scriptSrc.split("key=")[1] || "").split("&")[0];
    var modules = (scriptSrc.split("mds=")[1] || "").split("&")[0].split(",");

    function start() {
        require.config({
            baseUrl: rootPath,
            paths: {
                UTT: "lib",
                React: "bower_components/React/react"
            },
            shim: { exports: "React" }
        });

        require(["UTT/main"], function (UTT) {
            UTT.init({
                userKey: userKey,
                modules: modules,
                launch: true });
        });
    }

    if (typeof require === "undefined") {
        var s = document.createElement("script");
        s.onload = start;
        s.setAttribute("src", rootPath + "bower_components/requirejs/require.js");
        document.body.appendChild(s);
    } else {
        start();
    }
})();
//# sourceMappingURL=bookmarklet.js.map
"use strict";

define(["React", "UTT/components/UttBookmarklet"], function (React, UttBookmarklet) {

    var UTT = {
        bookmarkNode: null,
        containerNode: null,
        userKey: null,

        modulesLoaded: function modulesLoaded() {
            for (var _len = arguments.length, modules = Array(_len), _key = 0; _key < _len; _key++) {
                modules[_key] = arguments[_key];
            }

            var options = {
                userKey: UTT.userKey,
                url: require.toUrl(".")
            };
            modules.forEach(function (module) {
                return module.init(options);
            });
            UTT.bookmarkNode.props.modules = modules;
            React.render(UTT.bookmarkNode, UTT.containerNode);
        },

        init: function init(_ref) {
            var modules = _ref.modules;
            var userKey = _ref.userKey;

            var styleLink = UTT.createStyleNode();
            UTT.containerNode = UTT.createContainerNode();
            UTT.userKey = userKey;

            // Prefix module names
            modules = modules.map(function (modName) {
                return "UTT/modules/" + modName + "/" + modName;
            });

            require(modules, UTT.modulesLoaded);

            document.head.appendChild(styleLink);
            document.body.appendChild(UTT.containerNode);

            UTT.bookmarkNode = React.createElement(UttBookmarklet, { modules: [] });
            React.render(UTT.bookmarkNode, UTT.containerNode);
        },

        createStyleNode: function createStyleNode() {
            var id = "utt-bookmarklet-stylesheet";
            var link = document.getElementById(id);
            if (!link) {
                link = document.createElement("link");
                link.id = id;
                link.setAttribute("rel", "stylesheet");
                link.setAttribute("href", require.toUrl("UTT/components/assets/styles/main.css"));
            }
            return link;
        },

        createContainerNode: function createContainerNode() {
            var id = "utt-bookmarklet-container";
            var containerNode = document.getElementById(id);
            if (!containerNode) {
                containerNode = document.createElement("div");
                containerNode.id = id;
            }
            return containerNode;
        }
    };

    return UTT;
});
//# sourceMappingURL=main.js.map
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
"use strict";

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

define(["React", "UTT/components/questioner", "./questiondata", "UTT/utils/highlighter", "UTT/utils/assertion"], function (React, QuestionerElm, questionData, highlighter, assertion) {

    function isDecending(parent, child) {
        var node = child.parentNode;
        while (node !== null) {
            if (node === parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    var questioner = {
        name: "Questions",
        component: null,
        questions: null,
        userKey: null,
        url: null,
        subject: null,

        init: function init(_ref) {
            var userKey = _ref.userKey;
            var url = _ref.url;

            // Setup defaults
            Object.assign(questioner, {
                userKey: userKey, url: url,
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

        buildQuestions: function buildQuestions(questionData) {
            return Object.keys(questionData.questions).reduce(function (questions, questionId) {
                var question = questionData.questions[questionId];
                var nodes = highlighter.find(question.selector.css);
                nodes = Array.prototype.slice.call(nodes);
                var bookmarklet = highlighter.find("#utt-bookmarklet-container")[0];

                var elms = nodes.reduce(function (elms, elm) {
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
                if (typeof question.limit === "number") {
                    elms.splice(question.limit);
                }
                // For each element, create q question and push it on the questions array
                questions.push.apply(questions, _toConsumableArray(elms.map(function (element) {
                    return Object.assign({
                        element: element,
                        id: questionId
                    }, question);
                })));
                return questions;
            }, []);
        },

        onAnswer: function onAnswer(_ref, outcome) {
            var id = _ref.id;
            var element = _ref.element;

            var xhr = new XMLHttpRequest(); // new HttpRequest instance
            var target = questionData.postUrl || questioner.url + "assertions";
            var userKey = questioner.userKey;
            var url = questioner.url;
            var subject = questioner.subject;

            var assert = assertion.create({
                element: element, outcome: outcome, userKey: userKey, url: url, subject: subject,
                testcase: id });

            xhr.open("PUT", target);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify(assert));
        }
    };

    return questioner;
});
//# sourceMappingURL=questioner.js.map
"use strict";

define(function () {

	var assertion = {
		create: function create(_ref) {
			var element = _ref.element;
			var subject = _ref.subject;
			var testcase = _ref.testcase;
			var userKey = _ref.userKey;
			var mode = _ref.mode;
			var outcome = _ref.outcome;
			var url = _ref.url;

			return {
				subject: subject || null,
				mode: mode || "manual",
				testcase: testcase || null,
				result: {
					outcome: outcome || "untested",
					pointer: assertion.createPointer(element)
				},
				assertedBy: assertion.createAssertorFromKey(userKey, url)
			};
		},
		createPointer: function createPointer(domNode) {
			return {
				charSnippet: domNode.outerHTML.substr(0, 255)
			};
		},
		createAssertorFromKey: function createAssertorFromKey(userKey, url) {
			return url + "assertors/" + userKey;
		}
	};

	return assertion;
});
//# sourceMappingURL=assertion.js.map
"use strict";

define(function () {

	function highlighter(query) {
		var elm = document.querySelector(query);
		if (elm) {
			elm.className += " utt-highlight";
		}
	}

	highlighter.find = function (selector) {
		return document.querySelectorAll(selector);
	};

	return highlighter;
});
//# sourceMappingURL=highlighter.js.map
"use strict";

define(function () {
    return function (input) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        return input.replace(/\{(\d+)\}/g, function (match, capture) {
            return args[1 * capture];
        });
    };
});
//# sourceMappingURL=strFormat.js.map