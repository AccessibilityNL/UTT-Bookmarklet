"use strict";

(function () {

    var scriptSrc = document.getElementById("utt-bookmarklet").src;
    var baseUrl = scriptSrc.substring(0, scriptSrc.lastIndexOf("/") + 1);
    var userKey = (scriptSrc.split("key=")[1] || "").split("&")[0];
    var modules = (scriptSrc.split("mds=")[1] || "").split("&")[0].split(",");

    function start() {
        require.config({
            baseUrl: baseUrl,
            paths: {
                UTT: "lib",
                React: "bower_components/react/react-with-addons",
                qwest: "bower_components/qwest/qwest-min",
                "UTT/locale": "lib/locale/en"
            },
            shim: { exports: "React" }
        });

        require(["UTT/main"], function (UTT) {
            UTT.init({
                userKey: userKey,
                modules: modules,
                launch: true });
            if (window) {
                if (!window.UTT) {
                    window.UTT = {};
                }
                window.UTT.toggle = UTT.toggle;
            }
        });
    }

    if (typeof require === "undefined") {
        var s = document.createElement("script");
        s.onload = start;
        s.setAttribute("src", baseUrl + "bower_components/requirejs/require.js");
        document.body.appendChild(s);
    } else {
        start();
    }
})();
//# sourceMappingURL=bookmarklet.js.map
"use strict";

define(["UTT/locale/common", "UTT/locale/assessor/common", "UTT/locale/assessor/images", "UTT/locale/assessor/media", "UTT/locale/assessor/language", "UTT/locale/assessor/navigation", "UTT/locale/assessor/keyboard", "UTT/locale/reporter", "UTT/utils/browser-polyfill"], function () {
    var localeAssessor = require("UTT/locale/assessor/common");

    var assessorNames = ["images", "media", "language", "navigation", "keyboard"];

    var config = {
        apiUrl: "http://utt-dev.huell.appnormal.com/v1",
        modules: assessorNames.map(function (assessorName) {
            return {
                controller: "UTT/modules/assessor",
                config: {
                    icon: "icon-" + assessorName + ".svg",
                    iconIncomplete: "icon-" + assessorName + "-report-0.svg",
                    iconComplete: "icon-" + assessorName + "-report-1.svg",
                    questions: "UTT/modules/assessor/questions",
                    category: assessorName
                },
                locale: Object.assign(require("UTT/locale/assessor/" + assessorName), localeAssessor)
            };
        }),
        footerModule: {
            controller: "UTT/modules/reporter/reporter",
            config: {},
            locale: require("UTT/locale/reporter")
        },
        locale: require("UTT/locale/common")
    };

    return config;
});
//# sourceMappingURL=config.js.map
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
"use strict";

define(["./mockServer"], function (qwest) {
	var knownTypes = {
		Assertor: "assertors",
		evaluation: "evaluations",
		webpage: "webpages",
		Assertion: "assertions"
	};

	var type = "@type";
	var id = "@id";
	var userKeys = {
		evaluation: "creator",
		Assertion: "assertedBy"
	};
	var connections = {};
	var opt = {
		dataType: "json"
	};

	function wrapQwest(qPromise) {
		return new Promise(function (resolve, fail) {
			return qPromise.then(resolve)["catch"](fail);
		});
	}

	/**
  * [getUrlForEarl description]
  * @param  {[type]} apiUrl  [description]
  * @param  {[type]} earlObj [description]
  * @return {[type]}         [description]
  */
	function getUrlForEarl(apiUrl, earlObj) {
		var objId = "";
		var objType = earlObj[type];
		if (!knownTypes[objType]) {
			throw "Unknown EARL type " + earlObj.type;
		}

		if (typeof earlObj[id] === "string") {
			objId = "/" + earlObj[id];
		}
		return apiUrl + "/" + knownTypes[objType] + objId;
	}

	/**
  * Create a copy of the object, with all required properties
  *
  * Post/Put requires a signed user for evaluations and assertions
  * The @context is also added.
  * @param  {String} apiUrl
  * @param  {Object} userData
  * @param  {Object} earlObj  Object to sign
  * @return {Object}          Copy of the object with signed values
  */
	function prepEarlData(apiUrl, userData, earlObj) {
		var objType = earlObj[type];
		var base = {};

		if (!earlObj["@context"]) {
			base["@context"] = apiUrl + "/contexts/" + objType + ".jsonld";
		}
		if (userKeys[objType]) {
			base[userKeys[objType]] = userData;
		}
		return Object.assign(base, earlObj);
	}

	function createAdapter(apiUrl, userData) {
		// Bind with static values
		var prepEarl = prepEarlData.bind(null, apiUrl, userData);
		var getUrl = getUrlForEarl.bind(null, apiUrl);

		/**
   * Once connected, the adapter allows RESTful access
   * to the EARL API, with .post(), .get(), .put(), .delete()
   * @type {Object}
   */
		var earlAdapter = {
			/**
    * Create an EARL object at the server
    * @param  {object} earlObj Any type of EARL object
    * @return {Promise}        Once done, returns the object as stored on the server
    */
			post: function post(earlObj) {
				if (earlObj["@id"]) {
					throw "Error: can not create EARL " + earlObj[type] + " with an existing ID (" + earlObj["@id"] + ").";
				}
				return wrapQwest(qwest.post(getUrl(earlObj), prepEarl(earlObj), opt));
			},

			/**
    * Get the data of an EARL object
    * @param  {object} earlObj Any type of EARL object
    * @return {Promise}        Once done, returns the object as stored on the server
    */
			get: function get(earlObj) {
				if (!earlObj["@id"]) {
					throw "Error: can not get EARL " + earlObj[type] + " without a ID.";
				}
				return wrapQwest(qwest.get(getUrl(earlObj), prepEarl(earlObj), opt));
			},

			/**
    * Update an EARL object at the server
    * @param  {object} earlObj Any type of EARL object
    * @return {Promise}        Once done, returns the object as stored on the server
    */
			put: function put(earlObj) {
				if (!earlObj["@id"]) {
					throw "Error: can not update EARL " + earlObj[type] + " without an ID.";
				}
				return wrapQwest(qwest.put(getUrl(earlObj), prepEarl(earlObj), opt));
			},

			/**
    * Delete an EARL object from the server
    * @param  {object} earlObj Any type of EARL object
    * @return {Promise}        Once done, returns a boolean indicating success
    */
			"delete": function _delete(earlObj) {
				if (!earlObj["@id"]) {
					throw "Error: can not delete EARL " + earlObj[type] + " without an ID.";
				}
				return wrapQwest(qwest["delete"](getUrl(earlObj), prepEarl(earlObj), opt));
			} };

		return earlAdapter;
	}

	/**
  * Contains a single 'connect' which once connected returns the
  * adapter
  * @type {Object}
  */
	var earlApi = {
		/**
   * Connect to an EARL API
   * @param  {string} apiUrl
   * @param  {string} userkey
   * @return {Promise}         Which returns the adapter once done
   */
		connect: function connect(apiUrl, userkey) {
			if (connections[apiUrl]) {
				return new Promise(function (resolve) {
					resolve({ earlAdapter: connections[apiUrl] });
				});
			}

			return wrapQwest(qwest.get(apiUrl + "/assertors", {
				// 'q[_privateKey]': userkey
				q: userkey

			})).then(function (userData) {
				userData["utt:_privateKey"] = userkey;
				connections[apiUrl] = createAdapter(apiUrl, userData);
				return { earlAdapter: connections[apiUrl] };
			});
		}
	};

	return earlApi;
});
//# sourceMappingURL=earlApi.js.map
"use strict";

define([], function () {

	var earlPointers = {
		createPointer: function createPointer(domElm) {
			return "some .poineter #to .an.elm";
		}
	};

	return earlPointers;
});
//# sourceMappingURL=earlPointers.js.map
/**
 * This is a simple wrapper, it loads all in earlTools and puts them in
 * 1 object
 */
"use strict";

(function () {

	var modules = ["webpages", "assertions", "evaluations", "earlPointers", "earlApi"];

	define(modules.map(function (module) {
		return "./" + module;
	}), function () {

		var earlTools = modules.reduce(function (obj, module) {
			obj[module] = require("UTT/earlTools/" + module);
			return obj;
		}, {});
		return earlTools;
	});
})();
//# sourceMappingURL=earlTools.js.map
"use strict";

define([], function () {
	var evaluations = {

		protoEval: {
			"@type": "evaluation"
			// "creator":     undefined,
			// "auditResult": []
		},

		create: function create() {
			var base = arguments[0] === undefined ? {} : arguments[0];

			return Object.assign({
				auditResult: []
			}, evaluations.protoEval, base);
		}

	};

	return evaluations;
});
//# sourceMappingURL=evaluations.js.map
"use strict";

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

define(function () {
	console.warn("using MOCK connector!");
	var id = "@id";

	function mockRequest(url, obj) {
		for (var _len = arguments.length, params = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
			params[_key - 2] = arguments[_key];
		}

		var result = undefined;
		if (url.substr(-8) === "assertor") {
			result = (function () {
				var _result = {};

				_defineProperty(_result, id, url + "/fakeUserId");

				_defineProperty(_result, "@type", "http://xmlns.com/foaf/spec/#Person");

				return _result;
			})();
		} else {
			result = Object.assign({}, obj);
			if (!result[id]) {
				result[id] = url + "/FakeID!";
			}
		}

		console.log.apply(console, ["mock request to:", url, obj].concat(params, [result]));

		return new Promise(function (resolve) {
			setTimeout(resolve.bind(null, result), 100);
		});
	}

	var mockServer = {
		post: mockRequest,
		get: mockRequest,
		put: mockRequest,
		"delete": mockRequest
	};

	return mockServer;
});
//# sourceMappingURL=mockServer.js.map
"use strict";

define([], function () {

	var webpages = {
		protoPage: {
			"@type": "webpage",
			title: undefined,
			source: undefined
		},

		create: function create() {
			var base = arguments[0] === undefined ? {} : arguments[0];

			return Object.assign({}, webpages.protoPage, base);
		},

		createCurrent: function createCurrent() {
			var base = arguments[0] === undefined ? {} : arguments[0];

			if (window && window.document) {
				var title = document.querySelector("title").innerHTML;
				var source = window.location.href;
				base = Object.assign({ title: title, source: source }, base);
			}
			return webpages.create(base);
		}
	};

	return webpages;
});
//# sourceMappingURL=webpages.js.map
"use strict";

define({
    "no question": "No questions",
    "question {0}": "Question {0}",
    "more information": "More information" });
//# sourceMappingURL=common.js.map
"use strict";

define({
    CATG_TITLE: "Images",
    CATG_DESCR: "Test explination text 1 line."
});
//# sourceMappingURL=images.js.map
"use strict";

define({
  CATG_TITLE: "Keyboard",
  CATG_DESCR: "Test explination text 5 line." });
//# sourceMappingURL=keyboard.js.map
"use strict";

define({
  CATG_TITLE: "Language change",
  CATG_DESCR: "Test explination text 3 line." });
//# sourceMappingURL=language.js.map
"use strict";

define({
  CATG_TITLE: "Multimedia",
  CATG_DESCR: "Test explination text 2 line."
});
//# sourceMappingURL=media.js.map
"use strict";

define({
  CATG_TITLE: "Navigation",
  CATG_DESCR: "Test explination text 4 line."
});
//# sourceMappingURL=navigation.js.map
"use strict";

define({
    TOOL_NAME: "EIII-Bookmarklet",
    TOOL_BYLINE: "Accessibility checker for the EU",
    TOOL_DESCR: "Basic check for the accessibility of the web",
    "tool info": "Tool info",
    results: "Results",
    start: "Start",
    restart: "Restart",
    close: "Close",
    "Back to overview": "Back to overview",
    complete: "Complete",
    incomplete: "Incomplete",
    yes: "Yes",
    no: "No",
    Unclear: "Unclear"
});
//# sourceMappingURL=common.js.map
"use strict";

define({
	"Results list": "Results list" });
//# sourceMappingURL=reporter.js.map
"use strict";

define(["React", "UTT/components/UttBookmarklet", "./config", "UTT/modules/home", "UTT/utils/translator", "UTT/utils/browser-polyfill"], function (React, UttBookmarklet, config, home, translator) {
    var UTT = undefined;

    config.i18n = translator({ messageBundle: config.locale });

    function renderModule(comp, attr, children) {
        UTT.bookmarkNode = React.createElement(UttBookmarklet, {}, React.createElement(comp, attr, children));
        UTT.render();
    }

    function createModuleActivator(mod) {
        return function () {
            require([mod.controller], function (modController) {
                var i18n = translator({
                    messageBundle: Object.assign(mod.locale, config.locale)
                });
                modController(mod.config, i18n, renderModule);
            });
        };
    }

    UTT = {
        bookmarkNode: null,
        containerNode: null,
        running: false,
        config: null,
        userKey: null,
        render: function render() {
            UTT.running = true;
            React.render(UTT.bookmarkNode, UTT.containerNode);
        },

        init: function init(_ref) {
            var userKey = _ref.userKey;

            var styleLink = UTT.createStyleNode();
            UTT.containerNode = UTT.createContainerNode();
            config.modules = config.modules.map(function (mod) {
                return Object.assign({
                    activate: createModuleActivator(mod)
                }, mod);
            });

            if (config.footerModule) {
                var mod = config.footerModule;
                config.footerModule = Object.assign({
                    activate: createModuleActivator(mod)
                }, mod);
            }

            UTT.userKey = userKey;
            Object.freeze(config);
            UTT.config = config;

            document.head.appendChild(styleLink);
            document.body.appendChild(UTT.containerNode);

            this.showHome();
        },

        start: function start() {
            UTT.render();
        },

        stop: function stop() {
            UTT.running = false;
            React.unmountComponentAtNode(UTT.containerNode);
        },

        showHome: function showHome() {
            var modules = config.modules;
            var footerModule = config.footerModule;
            var i18n = config.i18n;

            UTT.bookmarkNode = React.createElement(UttBookmarklet, null, home({ modules: modules, footerModule: footerModule }, i18n));

            React.render(UTT.bookmarkNode, UTT.containerNode);
        },

        toggle: function toggle() {
            UTT[UTT.running ? "stop" : "start"]();
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

define(["React", "UTT/components/Assessor", "./assessor/buildQuestions", "./assessor/saveResult", "UTT/utils/highlighter"], function (React, Assessor) {

	var buildQuestions = require("UTT/modules/assessor/buildQuestions");
	var saveResult = require("UTT/modules/assessor/saveResult");
	var highlighter = require("UTT/utils/highlighter");

	return function assertor(config, i18n, render) {
		var questions = config.questions;
		var category = config.category;
		var icon = config.icon;

		require([questions, "UTT/main"], function (qData, UTT) {
			var questions = qData[category];
			var iconSrc = require.toUrl("UTT/components/assets/images/" + icon);

			if (!questions) {
				return;
			}
			questions = buildQuestions(questions);

			var showQuestion = (function (_showQuestion) {
				var _showQuestionWrapper = function showQuestion(_x) {
					return _showQuestion.apply(this, arguments);
				};

				_showQuestionWrapper.toString = function () {
					return _showQuestion.toString();
				};

				return _showQuestionWrapper;
			})(function (i) {
				var question = questions[i];
				var highlight = highlighter.bind(null, question.element);
				highlight();

				render(Assessor, {
					question: question,
					i18n: i18n,
					current: i + 1,
					iconSrc: iconSrc,
					highlight: highlight,
					total: questions.length,
					sendResult: function sendResult(outcome) {
						highlighter.removeHighlight();
						config.completed = false;
						saveResult(questions[i], outcome);
						if (questions[i + 1]) {
							showQuestion(i + 1);
						} else {
							config.completed = true;
							UTT.showHome();
						}
					}
				});
			});
			showQuestion(0);
		});
	};
});
//# sourceMappingURL=assessor.js.map
"use strict";

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

define(["UTT/utils/strFormat", "UTT/utils/highlighter"], function (strFormat, highlighter) {

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

    function createQuestionText(q) {
        return strFormat.apply(undefined, [q.text].concat(_toConsumableArray(q.variables.map(function (variable) {
            var value = undefined;
            var elm = q.element;
            if (variable === "text") {
                value = elm.textContent || elm.innerText;
            } else {
                value = elm.getAttribute(variable);
            }
            return value;
        }))));
    }

    function buildQuestions(questionData) {
        return Object.keys(questionData).reduce(function (questions, questionId) {
            var question = questionData[questionId];
            var nodes = highlighter.find(question.selector.css);

            nodes = Array.prototype.slice.call(nodes);
            var bookmarklet = highlighter.find("#utt-bookmarklet-container")[0];

            var elms = nodes.filter(function (elm) {
                return !isDecending(bookmarklet, elm);
            });

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
                    id: questionId }, question);
            })));

            questions.forEach(function (question) {
                question.text = createQuestionText(question);
            });
            return questions;
        }, []);
    }

    return buildQuestions;
});
//# sourceMappingURL=buildQuestions.js.map
"use strict";

define([], function () {

    var dummyQuestion = {
        selector: { css: "h1, h2, h3, h4, h5, h6" },
        text: "Are you having fun?",
        variables: [],
        limit: 3,
        help: "Summer means happy times and good sunshine. It means going to the beach, " + "going to Disneyland, having fun.",
        answers: [{ value: "passed", text: "yes" }, { value: "failed", text: "no" }, { value: "cantTell", text: "unclear" }]
    };

    var data = {
        // postUrl: '' // (optionsal) Path to which the data should be posted
        images: {
            "auto-wcag:1.1.1-img-alt": {
                selector: { css: "img[alt]" },
                variables: ["alt"],
                text: "Is \"{0}\" a good description for this image?",
                help: "some text about images",
                limit: 10,
                answers: [{ value: "passed", text: "yes" }, { value: "failed", text: "no" }, { value: "cantTell", text: "Unclear" }]
            }
        },

        navigation: {
            "auto-wcag:2-4-2-title": {
                selector: { css: "title" },
                variables: ["text"],
                text: "Is \"{0}\" a good description for this page?",
                help: "some text about titles",
                limit: 1,
                answers: [{ value: "passed", text: "yes" }, { value: "failed", text: "no" }, { value: "cantTell", text: "Unclear" }]
            }
        },

        media: {
            "auto-wcag:having-fun1": dummyQuestion,
            "auto-wcag:having-fun2": dummyQuestion,
            "auto-wcag:having-fun3": dummyQuestion
        },
        language: {
            "auto-wcag:having-fun1": dummyQuestion,
            "auto-wcag:having-fun2": dummyQuestion,
            "auto-wcag:having-fun3": dummyQuestion
        },
        keyboard: {
            "auto-wcag:having-fun1": dummyQuestion,
            "auto-wcag:having-fun2": dummyQuestion,
            "auto-wcag:having-fun3": dummyQuestion
        }
    };

    return data;
});
//# sourceMappingURL=questions.js.map
"use strict";

define(["UTT/main", "UTT/earlTools/earlTools"], function (UTT) {

    var earlApi = require("UTT/earlTools/earlApi");
    var pages = require("UTT/earlTools/webpages");
    var evaluations = require("UTT/earlTools/evaluations");
    var assertions = require("UTT/earlTools/assertions");

    var webpage = undefined; // cached page
    var evaluation = undefined; // cached eval
    var auditResult = undefined; // cached audit results

    var logError = console.error.bind(console);
    var apiUrl = UTT.config.apiUrl;
    var userKey = UTT.userKey;

    var saveResult = function saveResult(question, outcome) {
        // First, get the connection, or open one if there isn't one yet
        earlApi.connect(apiUrl, userKey)

        // Get a webpage
        .then(function (_ref) {
            var earlAdapter = _ref.earlAdapter;

            // Check if the page is known
            if (webpage) {
                return { earlAdapter: earlAdapter, webpage: webpage };
            }

            // If not, create and send it to the server
            return earlAdapter.post(pages.createCurrent()).then(function (page) {
                webpage = page;
                return { earlAdapter: earlAdapter, webpage: webpage };
            });
        }).then(function (_ref) {
            var earlAdapter = _ref.earlAdapter;
            var webpage = _ref.webpage;

            var promise = undefined;
            var assertion = assertions.createFromQuestion({
                webpage: webpage, question: question, outcome: outcome
            });

            if (!evaluation) {
                evaluation = evaluations.create();
                auditResult = evaluation.auditResult;
                auditResult.push(assertion);
                promise = earlAdapter.post(evaluation).then(function (response) {
                    delete response.assertions;
                    Object.assign(evaluation, response);
                    return evaluation;
                });
            } else {
                assertion.evaluation = evaluation["@id"];
                auditResult.push(assertion);
                promise = earlAdapter.post(assertion);
            }

            return promise;
        })["catch"](logError);
    };

    return saveResult;
});
//# sourceMappingURL=saveResult.js.map
"use strict";

define(["React", "UTT/components/HomePanel", "UTT/utils/browser-polyfill"], function (React, HomePanel) {

	return function home(_ref, i18n) {
		var modules = _ref.modules;
		var footerModule = _ref.footerModule;

		return React.createElement(HomePanel, { modules: modules, footerModule: footerModule, i18n: i18n });
	};
});
//# sourceMappingURL=home.js.map
"use strict";

define(["UTT/components/Reporter"], function (Reporter) {

	var reporter = function reporter(config, i18n, render) {

		render(Reporter, {
			i18n: i18n });
	};

	return reporter;
});
//# sourceMappingURL=reporter.js.map
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

(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;if (!u && a) {
          return a(o, !0);
        }if (i) {
          return i(o, !0);
        }var f = new Error("Cannot find module '" + o + "'");throw (f.code = "MODULE_NOT_FOUND", f);
      }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
        var n = t[o][1][e];return s(n ? n : e);
      }, l, l.exports, e, t, n, r);
    }return n[o].exports;
  }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) s(r[o]);return s;
})({ 1: [function (require, module, exports) {
    (function (global) {
      "use strict";if (global._babelPolyfill) {
        throw new Error("only one instance of babel/polyfill is allowed");
      }global._babelPolyfill = true;require("core-js/shim");require("regenerator-babel/runtime");
    }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
  }, { "core-js/shim": 2, "regenerator-babel/runtime": 3 }], 2: [function (require, module, exports) {
    !(function (global, framework, undefined) {
      "use strict";var OBJECT = "Object",
          FUNCTION = "Function",
          ARRAY = "Array",
          STRING = "String",
          NUMBER = "Number",
          REGEXP = "RegExp",
          DATE = "Date",
          MAP = "Map",
          SET = "Set",
          WEAKMAP = "WeakMap",
          WEAKSET = "WeakSet",
          SYMBOL = "Symbol",
          PROMISE = "Promise",
          MATH = "Math",
          ARGUMENTS = "Arguments",
          PROTOTYPE = "prototype",
          CONSTRUCTOR = "constructor",
          TO_STRING = "toString",
          TO_STRING_TAG = TO_STRING + "Tag",
          TO_LOCALE = "toLocaleString",
          HAS_OWN = "hasOwnProperty",
          FOR_EACH = "forEach",
          ITERATOR = "iterator",
          FF_ITERATOR = "@@" + ITERATOR,
          PROCESS = "process",
          CREATE_ELEMENT = "createElement",
          Function = global[FUNCTION],
          Object = global[OBJECT],
          Array = global[ARRAY],
          String = global[STRING],
          Number = global[NUMBER],
          RegExp = global[REGEXP],
          Date = global[DATE],
          Map = global[MAP],
          Set = global[SET],
          WeakMap = global[WEAKMAP],
          WeakSet = global[WEAKSET],
          Symbol = global[SYMBOL],
          Math = global[MATH],
          TypeError = global.TypeError,
          RangeError = global.RangeError,
          setTimeout = global.setTimeout,
          setImmediate = global.setImmediate,
          clearImmediate = global.clearImmediate,
          parseInt = global.parseInt,
          isFinite = global.isFinite,
          process = global[PROCESS],
          nextTick = process && process.nextTick,
          document = global.document,
          html = document && document.documentElement,
          navigator = global.navigator,
          define = global.define,
          console = global.console || {},
          ArrayProto = Array[PROTOTYPE],
          ObjectProto = Object[PROTOTYPE],
          FunctionProto = Function[PROTOTYPE],
          Infinity = 1 / 0,
          DOT = ".";function isObject(it) {
        return it !== null && (typeof it == "object" || typeof it == "function");
      }function isFunction(it) {
        return typeof it == "function";
      }var isNative = ctx(/./.test, /\[native code\]\s*\}\s*$/, 1);var toString = ObjectProto[TO_STRING];function setToStringTag(it, tag, stat) {
        if (it && !has(it = stat ? it : it[PROTOTYPE], SYMBOL_TAG)) hidden(it, SYMBOL_TAG, tag);
      }function cof(it) {
        return toString.call(it).slice(8, -1);
      }function classof(it) {
        var O, T;return it == undefined ? it === undefined ? "Undefined" : "Null" : typeof (T = (O = Object(it))[SYMBOL_TAG]) == "string" ? T : cof(O);
      }var call = FunctionProto.call,
          apply = FunctionProto.apply,
          REFERENCE_GET;function part() {
        var fn = assertFunction(this),
            length = arguments.length,
            args = Array(length),
            i = 0,
            _ = path._,
            holder = false;while (length > i) if ((args[i] = arguments[i++]) === _) holder = true;return function () {
          var that = this,
              _length = arguments.length,
              i = 0,
              j = 0,
              _args;if (!holder && !_length) return invoke(fn, args, that);_args = args.slice();if (holder) for (; length > i; i++) if (_args[i] === _) _args[i] = arguments[j++];while (_length > j) _args.push(arguments[j++]);return invoke(fn, _args, that);
        };
      }function ctx(fn, that, length) {
        assertFunction(fn);if (~length && that === undefined) {
          return fn;
        }switch (length) {case 1:
            return function (a) {
              return fn.call(that, a);
            };case 2:
            return function (a, b) {
              return fn.call(that, a, b);
            };case 3:
            return function (a, b, c) {
              return fn.call(that, a, b, c);
            };}return function () {
          return fn.apply(that, arguments);
        };
      }function invoke(fn, args, that) {
        var un = that === undefined;switch (args.length | 0) {case 0:
            return un ? fn() : fn.call(that);case 1:
            return un ? fn(args[0]) : fn.call(that, args[0]);case 2:
            return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);case 3:
            return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);case 4:
            return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);case 5:
            return un ? fn(args[0], args[1], args[2], args[3], args[4]) : fn.call(that, args[0], args[1], args[2], args[3], args[4]);}return fn.apply(that, args);
      }var create = Object.create,
          getPrototypeOf = Object.getPrototypeOf,
          setPrototypeOf = Object.setPrototypeOf,
          defineProperty = Object.defineProperty,
          defineProperties = Object.defineProperties,
          getOwnDescriptor = Object.getOwnPropertyDescriptor,
          getKeys = Object.keys,
          getNames = Object.getOwnPropertyNames,
          getSymbols = Object.getOwnPropertySymbols,
          isFrozen = Object.isFrozen,
          has = ctx(call, ObjectProto[HAS_OWN], 2),
          ES5Object = Object,
          Dict;function toObject(it) {
        return ES5Object(assertDefined(it));
      }function returnIt(it) {
        return it;
      }function returnThis() {
        return this;
      }function get(object, key) {
        if (has(object, key)) {
          return object[key];
        }
      }function ownKeys(it) {
        assertObject(it);return getSymbols ? getNames(it).concat(getSymbols(it)) : getNames(it);
      }var assign = Object.assign || function (target, source) {
        var T = Object(assertDefined(target)),
            l = arguments.length,
            i = 1;while (l > i) {
          var S = ES5Object(arguments[i++]),
              keys = getKeys(S),
              length = keys.length,
              j = 0,
              key;while (length > j) T[key = keys[j++]] = S[key];
        }return T;
      };function keyOf(object, el) {
        var O = toObject(object),
            keys = getKeys(O),
            length = keys.length,
            index = 0,
            key;while (length > index) if (O[key = keys[index++]] === el) {
          return key;
        }
      }function array(it) {
        return String(it).split(",");
      }var push = ArrayProto.push,
          unshift = ArrayProto.unshift,
          slice = ArrayProto.slice,
          splice = ArrayProto.splice,
          indexOf = ArrayProto.indexOf,
          forEach = ArrayProto[FOR_EACH];function createArrayMethod(type) {
        var isMap = type == 1,
            isFilter = type == 2,
            isSome = type == 3,
            isEvery = type == 4,
            isFindIndex = type == 6,
            noholes = type == 5 || isFindIndex;return function (callbackfn) {
          var O = Object(assertDefined(this)),
              that = arguments[1],
              self = ES5Object(O),
              f = ctx(callbackfn, that, 3),
              length = toLength(self.length),
              index = 0,
              result = isMap ? Array(length) : isFilter ? [] : undefined,
              val,
              res;for (; length > index; index++) if (noholes || index in self) {
            val = self[index];res = f(val, index, O);if (type) {
              if (isMap) result[index] = res;else if (res) switch (type) {case 3:
                  return true;case 5:
                  return val;case 6:
                  return index;case 2:
                  result.push(val);} else if (isEvery) return false;
            }
          }return isFindIndex ? -1 : isSome || isEvery ? isEvery : result;
        };
      }function createArrayContains(isContains) {
        return function (el) {
          var O = toObject(this),
              length = toLength(O.length),
              index = toIndex(arguments[1], length);if (isContains && el != el) {
            for (; length > index; index++) if (sameNaN(O[index])) return isContains || index;
          } else for (; length > index; index++) if (isContains || index in O) {
            if (O[index] === el) return isContains || index;
          }return !isContains && -1;
        };
      }function generic(A, B) {
        return typeof A == "function" ? A : B;
      }var MAX_SAFE_INTEGER = 9007199254740991,
          pow = Math.pow,
          abs = Math.abs,
          ceil = Math.ceil,
          floor = Math.floor,
          max = Math.max,
          min = Math.min,
          random = Math.random,
          trunc = Math.trunc || function (it) {
        return (it > 0 ? floor : ceil)(it);
      };function sameNaN(number) {
        return number != number;
      }function toInteger(it) {
        return isNaN(it) ? 0 : trunc(it);
      }function toLength(it) {
        return it > 0 ? min(toInteger(it), MAX_SAFE_INTEGER) : 0;
      }function toIndex(index, length) {
        var index = toInteger(index);return index < 0 ? max(index + length, 0) : min(index, length);
      }function lz(num) {
        return num > 9 ? num : "0" + num;
      }function createReplacer(regExp, replace, isStatic) {
        var replacer = isObject(replace) ? function (part) {
          return replace[part];
        } : replace;return function (it) {
          return String(isStatic ? it : this).replace(regExp, replacer);
        };
      }function createPointAt(toString) {
        return function (pos) {
          var s = String(assertDefined(this)),
              i = toInteger(pos),
              l = s.length,
              a,
              b;if (i < 0 || i >= l) return toString ? "" : undefined;a = s.charCodeAt(i);return a < 55296 || a > 56319 || i + 1 === l || (b = s.charCodeAt(i + 1)) < 56320 || b > 57343 ? toString ? s.charAt(i) : a : toString ? s.slice(i, i + 2) : (a - 55296 << 10) + (b - 56320) + 65536;
        };
      }var REDUCE_ERROR = "Reduce of empty object with no initial value";function assert(condition, msg1, msg2) {
        if (!condition) throw TypeError(msg2 ? msg1 + msg2 : msg1);
      }function assertDefined(it) {
        if (it == undefined) throw TypeError("Function called on null or undefined");return it;
      }function assertFunction(it) {
        assert(isFunction(it), it, " is not a function!");return it;
      }function assertObject(it) {
        assert(isObject(it), it, " is not an object!");return it;
      }function assertInstance(it, Constructor, name) {
        assert(it instanceof Constructor, name, ": use the 'new' operator!");
      }function descriptor(bitmap, value) {
        return { enumerable: !(bitmap & 1), configurable: !(bitmap & 2), writable: !(bitmap & 4), value: value };
      }function simpleSet(object, key, value) {
        object[key] = value;return object;
      }function createDefiner(bitmap) {
        return DESC ? function (object, key, value) {
          return defineProperty(object, key, descriptor(bitmap, value));
        } : simpleSet;
      }function uid(key) {
        return SYMBOL + "(" + key + ")_" + (++sid + random())[TO_STRING](36);
      }function getWellKnownSymbol(name, setter) {
        return Symbol && Symbol[name] || (setter ? Symbol : safeSymbol)(SYMBOL + DOT + name);
      }var DESC = !!(function () {
        try {
          return defineProperty({}, "a", { get: function get() {
              return 2;
            } }).a == 2;
        } catch (e) {}
      })(),
          sid = 0,
          hidden = createDefiner(1),
          set = Symbol ? simpleSet : hidden,
          safeSymbol = Symbol || uid;function assignHidden(target, src) {
        for (var key in src) hidden(target, key, src[key]);return target;
      }var SYMBOL_UNSCOPABLES = getWellKnownSymbol("unscopables"),
          ArrayUnscopables = ArrayProto[SYMBOL_UNSCOPABLES] || {},
          SYMBOL_TAG = getWellKnownSymbol(TO_STRING_TAG),
          SYMBOL_SPECIES = getWellKnownSymbol("species"),
          SYMBOL_ITERATOR;function setSpecies(C) {
        if (DESC && (framework || !isNative(C))) defineProperty(C, SYMBOL_SPECIES, { configurable: true, get: returnThis });
      }var NODE = cof(process) == PROCESS,
          core = {},
          path = framework ? global : core,
          old = global.core,
          exportGlobal,
          FORCED = 1,
          GLOBAL = 2,
          STATIC = 4,
          PROTO = 8,
          BIND = 16,
          WRAP = 32;function $define(type, name, source) {
        var key,
            own,
            out,
            exp,
            isGlobal = type & GLOBAL,
            target = isGlobal ? global : type & STATIC ? global[name] : (global[name] || ObjectProto)[PROTOTYPE],
            exports = isGlobal ? core : core[name] || (core[name] = {});if (isGlobal) source = name;for (key in source) {
          own = !(type & FORCED) && target && key in target && (!isFunction(target[key]) || isNative(target[key]));out = (own ? target : source)[key];if (!framework && isGlobal && !isFunction(target[key])) exp = source[key];else if (type & BIND && own) exp = ctx(out, global);else if (type & WRAP && !framework && target[key] == out) {
            exp = function (param) {
              return this instanceof out ? new out(param) : out(param);
            };exp[PROTOTYPE] = out[PROTOTYPE];
          } else exp = type & PROTO && isFunction(out) ? ctx(call, out) : out;if (framework && target && !own) {
            if (isGlobal) target[key] = out;else delete target[key] && hidden(target, key, out);
          }if (exports[key] != out) hidden(exports, key, exp);
        }
      }if (typeof module != "undefined" && module.exports) module.exports = core;else if (isFunction(define) && define.amd) define(function () {
        return core;
      });else exportGlobal = true;if (exportGlobal || framework) {
        core.noConflict = function () {
          global.core = old;return core;
        };global.core = core;
      }SYMBOL_ITERATOR = getWellKnownSymbol(ITERATOR);var ITER = safeSymbol("iter"),
          KEY = 1,
          VALUE = 2,
          Iterators = {},
          IteratorPrototype = {},
          BUGGY_ITERATORS = "keys" in ArrayProto && !("next" in [].keys());setIterator(IteratorPrototype, returnThis);function setIterator(O, value) {
        hidden(O, SYMBOL_ITERATOR, value);FF_ITERATOR in ArrayProto && hidden(O, FF_ITERATOR, value);
      }function createIterator(Constructor, NAME, next, proto) {
        Constructor[PROTOTYPE] = create(proto || IteratorPrototype, { next: descriptor(1, next) });setToStringTag(Constructor, NAME + " Iterator");
      }function defineIterator(Constructor, NAME, value, DEFAULT) {
        var proto = Constructor[PROTOTYPE],
            iter = get(proto, SYMBOL_ITERATOR) || get(proto, FF_ITERATOR) || DEFAULT && get(proto, DEFAULT) || value;if (framework) {
          setIterator(proto, iter);if (iter !== value) {
            var iterProto = getPrototypeOf(iter.call(new Constructor()));setToStringTag(iterProto, NAME + " Iterator", true);has(proto, FF_ITERATOR) && setIterator(iterProto, returnThis);
          }
        }Iterators[NAME] = iter;Iterators[NAME + " Iterator"] = returnThis;return iter;
      }function defineStdIterators(Base, NAME, Constructor, next, DEFAULT, IS_SET) {
        function createIter(kind) {
          return function () {
            return new Constructor(this, kind);
          };
        }createIterator(Constructor, NAME, next);var entries = createIter(KEY + VALUE),
            values = createIter(VALUE);if (DEFAULT == VALUE) values = defineIterator(Base, NAME, values, "values");else entries = defineIterator(Base, NAME, entries, "entries");if (DEFAULT) {
          $define(PROTO + FORCED * BUGGY_ITERATORS, NAME, { entries: entries, keys: IS_SET ? values : createIter(KEY), values: values });
        }
      }function iterResult(done, value) {
        return { value: value, done: !!done };
      }function isIterable(it) {
        var O = Object(it),
            Symbol = global[SYMBOL],
            hasExt = ((Symbol && Symbol[ITERATOR] || FF_ITERATOR) in O);return hasExt || SYMBOL_ITERATOR in O || has(Iterators, classof(O));
      }function getIterator(it) {
        var Symbol = global[SYMBOL],
            ext = it[Symbol && Symbol[ITERATOR] || FF_ITERATOR],
            getIter = ext || it[SYMBOL_ITERATOR] || Iterators[classof(it)];return assertObject(getIter.call(it));
      }function stepCall(fn, value, entries) {
        return entries ? invoke(fn, value) : fn(value);
      }function checkDangerIterClosing(fn) {
        var danger = true;var O = { next: function next() {
            throw 1;
          }, "return": function _return() {
            danger = false;
          } };O[SYMBOL_ITERATOR] = returnThis;try {
          fn(O);
        } catch (e) {}return danger;
      }function closeIterator(iterator) {
        var ret = iterator["return"];if (ret !== undefined) ret.call(iterator);
      }function safeIterClose(exec, iterator) {
        try {
          exec(iterator);
        } catch (e) {
          closeIterator(iterator);throw e;
        }
      }function forOf(iterable, entries, fn, that) {
        safeIterClose(function (iterator) {
          var f = ctx(fn, that, entries ? 2 : 1),
              step;while (!(step = iterator.next()).done) if (stepCall(f, step.value, entries) === false) {
            return closeIterator(iterator);
          }
        }, getIterator(iterable));
      }!(function (TAG, SymbolRegistry, AllSymbols, setter) {
        if (!isNative(Symbol)) {
          Symbol = function (description) {
            assert(!(this instanceof Symbol), SYMBOL + " is not a " + CONSTRUCTOR);var tag = uid(description),
                sym = set(create(Symbol[PROTOTYPE]), TAG, tag);AllSymbols[tag] = sym;DESC && setter && defineProperty(ObjectProto, tag, { configurable: true, set: function set(value) {
                hidden(this, tag, value);
              } });return sym;
          };hidden(Symbol[PROTOTYPE], TO_STRING, function () {
            return this[TAG];
          });
        }$define(GLOBAL + WRAP, { Symbol: Symbol });var symbolStatics = { "for": function _for(key) {
            return has(SymbolRegistry, key += "") ? SymbolRegistry[key] : SymbolRegistry[key] = Symbol(key);
          }, iterator: SYMBOL_ITERATOR || getWellKnownSymbol(ITERATOR), keyFor: part.call(keyOf, SymbolRegistry), species: SYMBOL_SPECIES, toStringTag: SYMBOL_TAG = getWellKnownSymbol(TO_STRING_TAG, true), unscopables: SYMBOL_UNSCOPABLES, pure: safeSymbol, set: set, useSetter: function useSetter() {
            setter = true;
          }, useSimple: function useSimple() {
            setter = false;
          } };forEach.call(array("hasInstance,isConcatSpreadable,match,replace,search,split,toPrimitive"), function (it) {
          symbolStatics[it] = getWellKnownSymbol(it);
        });$define(STATIC, SYMBOL, symbolStatics);setToStringTag(Symbol, SYMBOL);$define(STATIC + FORCED * !isNative(Symbol), OBJECT, { getOwnPropertyNames: function getOwnPropertyNames(it) {
            var names = getNames(toObject(it)),
                result = [],
                key,
                i = 0;while (names.length > i) has(AllSymbols, key = names[i++]) || result.push(key);return result;
          }, getOwnPropertySymbols: function getOwnPropertySymbols(it) {
            var names = getNames(toObject(it)),
                result = [],
                key,
                i = 0;while (names.length > i) has(AllSymbols, key = names[i++]) && result.push(AllSymbols[key]);return result;
          } });setToStringTag(Math, MATH, true);setToStringTag(global.JSON, "JSON", true);
      })(safeSymbol("tag"), {}, {}, true);!(function () {
        var objectStatic = { assign: assign, is: function is(x, y) {
            return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
          } };"__proto__" in ObjectProto && (function (buggy, set) {
          try {
            set = ctx(call, getOwnDescriptor(ObjectProto, "__proto__").set, 2);set({}, ArrayProto);
          } catch (e) {
            buggy = true;
          }objectStatic.setPrototypeOf = setPrototypeOf = setPrototypeOf || function (O, proto) {
            assertObject(O);assert(proto === null || isObject(proto), proto, ": can't set as prototype!");if (buggy) O.__proto__ = proto;else set(O, proto);return O;
          };
        })();$define(STATIC, OBJECT, objectStatic);
      })();!(function (tmp) {
        tmp[SYMBOL_TAG] = DOT;if (cof(tmp) != DOT) hidden(ObjectProto, TO_STRING, function () {
          return "[object " + classof(this) + "]";
        });
      })({});!(function () {
        function wrapObjectMethod(key, MODE) {
          var fn = Object[key],
              exp = core[OBJECT][key],
              f = 0,
              o = {};if (!exp || isNative(exp)) {
            o[key] = MODE == 1 ? function (it) {
              return isObject(it) ? fn(it) : it;
            } : MODE == 2 ? function (it) {
              return isObject(it) ? fn(it) : true;
            } : MODE == 3 ? function (it) {
              return isObject(it) ? fn(it) : false;
            } : MODE == 4 ? function (it, key) {
              return fn(toObject(it), key);
            } : function (it) {
              return fn(toObject(it));
            };try {
              fn(DOT);
            } catch (e) {
              f = 1;
            }$define(STATIC + FORCED * f, OBJECT, o);
          }
        }wrapObjectMethod("freeze", 1);wrapObjectMethod("seal", 1);wrapObjectMethod("preventExtensions", 1);wrapObjectMethod("isFrozen", 2);wrapObjectMethod("isSealed", 2);wrapObjectMethod("isExtensible", 3);wrapObjectMethod("getOwnPropertyDescriptor", 4);wrapObjectMethod("getPrototypeOf");wrapObjectMethod("keys");wrapObjectMethod("getOwnPropertyNames");
      })();!(function (NAME) {
        NAME in FunctionProto || DESC && defineProperty(FunctionProto, NAME, { configurable: true, get: function get() {
            var match = String(this).match(/^\s*function ([^ (]*)/),
                name = match ? match[1] : "";has(this, NAME) || defineProperty(this, NAME, descriptor(5, name));return name;
          }, set: function set(value) {
            has(this, NAME) || defineProperty(this, NAME, descriptor(0, value));
          } });
      })("name");Number("0o1") && Number("0b1") || (function (_Number, NumberProto) {
        function toNumber(it) {
          if (isObject(it)) it = toPrimitive(it);if (typeof it == "string" && it.length > 2 && it.charCodeAt(0) == 48) {
            var binary = false;switch (it.charCodeAt(1)) {case 66:case 98:
                binary = true;case 79:case 111:
                return parseInt(it.slice(2), binary ? 2 : 8);}
          }return +it;
        }function toPrimitive(it) {
          var fn, val;if (isFunction(fn = it.valueOf) && !isObject(val = fn.call(it))) {
            return val;
          }if (isFunction(fn = it[TO_STRING]) && !isObject(val = fn.call(it))) {
            return val;
          }throw TypeError("Can't convert object to number");
        }Number = function Number(it) {
          return this instanceof Number ? new _Number(toNumber(it)) : toNumber(it);
        };forEach.call(DESC ? getNames(_Number) : array("MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY"), function (key) {
          key in Number || defineProperty(Number, key, getOwnDescriptor(_Number, key));
        });Number[PROTOTYPE] = NumberProto;NumberProto[CONSTRUCTOR] = Number;hidden(global, NUMBER, Number);
      })(Number, Number[PROTOTYPE]);!(function (isInteger) {
        $define(STATIC, NUMBER, { EPSILON: pow(2, -52), isFinite: (function (_isFinite) {
            var _isFiniteWrapper = function isFinite(_x) {
              return _isFinite.apply(this, arguments);
            };

            _isFiniteWrapper.toString = function () {
              return _isFinite.toString();
            };

            return _isFiniteWrapper;
          })(function (it) {
            return typeof it == "number" && isFinite(it);
          }), isInteger: isInteger, isNaN: sameNaN, isSafeInteger: function isSafeInteger(number) {
            return isInteger(number) && abs(number) <= MAX_SAFE_INTEGER;
          }, MAX_SAFE_INTEGER: MAX_SAFE_INTEGER, MIN_SAFE_INTEGER: -MAX_SAFE_INTEGER, parseFloat: parseFloat, parseInt: parseInt });
      })(Number.isInteger || function (it) {
        return !isObject(it) && isFinite(it) && floor(it) === it;
      });!(function () {
        var E = Math.E,
            exp = Math.exp,
            log = Math.log,
            sqrt = Math.sqrt,
            sign = Math.sign || function (x) {
          return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
        };function asinh(x) {
          return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log(x + sqrt(x * x + 1));
        }function expm1(x) {
          return (x = +x) == 0 ? x : x > -0.000001 && x < 0.000001 ? x + x * x / 2 : exp(x) - 1;
        }$define(STATIC, MATH, { acosh: function acosh(x) {
            return (x = +x) < 1 ? NaN : isFinite(x) ? log(x / E + sqrt(x + 1) * sqrt(x - 1) / E) + 1 : x;
          }, asinh: asinh, atanh: function atanh(x) {
            return (x = +x) == 0 ? x : log((1 + x) / (1 - x)) / 2;
          }, cbrt: function cbrt(x) {
            return sign(x = +x) * pow(abs(x), 1 / 3);
          }, clz32: function clz32(x) {
            return (x >>>= 0) ? 32 - x[TO_STRING](2).length : 32;
          }, cosh: function cosh(x) {
            return (exp(x = +x) + exp(-x)) / 2;
          }, expm1: expm1, fround: function fround(x) {
            return new Float32Array([x])[0];
          }, hypot: function hypot(value1, value2) {
            var sum = 0,
                len1 = arguments.length,
                len2 = len1,
                args = Array(len1),
                larg = -Infinity,
                arg;while (len1--) {
              arg = args[len1] = +arguments[len1];if (arg == Infinity || arg == -Infinity) {
                return Infinity;
              }if (arg > larg) larg = arg;
            }larg = arg || 1;while (len2--) sum += pow(args[len2] / larg, 2);return larg * sqrt(sum);
          }, imul: function imul(x, y) {
            var UInt16 = 65535,
                xn = +x,
                yn = +y,
                xl = UInt16 & xn,
                yl = UInt16 & yn;return 0 | xl * yl + ((UInt16 & xn >>> 16) * yl + xl * (UInt16 & yn >>> 16) << 16 >>> 0);
          }, log1p: function log1p(x) {
            return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log(1 + x);
          }, log10: function log10(x) {
            return log(x) / Math.LN10;
          }, log2: function log2(x) {
            return log(x) / Math.LN2;
          }, sign: sign, sinh: function sinh(x) {
            return abs(x = +x) < 1 ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (E / 2);
          }, tanh: function tanh(x) {
            var a = expm1(x = +x),
                b = expm1(-x);return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
          }, trunc: trunc });
      })();!(function (fromCharCode) {
        function assertNotRegExp(it) {
          if (cof(it) == REGEXP) throw TypeError();
        }$define(STATIC, STRING, { fromCodePoint: function fromCodePoint(x) {
            var res = [],
                len = arguments.length,
                i = 0,
                code;while (len > i) {
              code = +arguments[i++];if (toIndex(code, 1114111) !== code) throw RangeError(code + " is not a valid code point");res.push(code < 65536 ? fromCharCode(code) : fromCharCode(((code -= 65536) >> 10) + 55296, code % 1024 + 56320));
            }return res.join("");
          }, raw: (function (_raw) {
            var _rawWrapper = function raw(_x) {
              return _raw.apply(this, arguments);
            };

            _rawWrapper.toString = function () {
              return _raw.toString();
            };

            return _rawWrapper;
          })(function (callSite) {
            var raw = toObject(callSite.raw),
                len = toLength(raw.length),
                sln = arguments.length,
                res = [],
                i = 0;while (len > i) {
              res.push(String(raw[i++]));if (i < sln) res.push(String(arguments[i]));
            }return res.join("");
          }) });$define(PROTO, STRING, { codePointAt: createPointAt(false), endsWith: function endsWith(searchString) {
            assertNotRegExp(searchString);var that = String(assertDefined(this)),
                endPosition = arguments[1],
                len = toLength(that.length),
                end = endPosition === undefined ? len : min(toLength(endPosition), len);searchString += "";return that.slice(end - searchString.length, end) === searchString;
          }, includes: function includes(searchString) {
            assertNotRegExp(searchString);return !! ~String(assertDefined(this)).indexOf(searchString, arguments[1]);
          }, repeat: function repeat(count) {
            var str = String(assertDefined(this)),
                res = "",
                n = toInteger(count);if (0 > n || n == Infinity) throw RangeError("Count can't be negative");for (; n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;return res;
          }, startsWith: function startsWith(searchString) {
            assertNotRegExp(searchString);var that = String(assertDefined(this)),
                index = toLength(min(arguments[1], that.length));searchString += "";return that.slice(index, index + searchString.length) === searchString;
          } });
      })(String.fromCharCode);!(function () {
        $define(STATIC + FORCED * checkDangerIterClosing(Array.from), ARRAY, { from: function from(arrayLike) {
            var O = Object(assertDefined(arrayLike)),
                mapfn = arguments[1],
                mapping = mapfn !== undefined,
                f = mapping ? ctx(mapfn, arguments[2], 2) : undefined,
                index = 0,
                length,
                result,
                step;if (isIterable(O)) {
              result = new (generic(this, Array))();safeIterClose(function (iterator) {
                for (; !(step = iterator.next()).done; index++) {
                  result[index] = mapping ? f(step.value, index) : step.value;
                }
              }, getIterator(O));
            } else {
              result = new (generic(this, Array))(length = toLength(O.length));for (; length > index; index++) {
                result[index] = mapping ? f(O[index], index) : O[index];
              }
            }result.length = index;return result;
          } });$define(STATIC, ARRAY, { of: function of() {
            var index = 0,
                length = arguments.length,
                result = new (generic(this, Array))(length);while (length > index) result[index] = arguments[index++];result.length = length;return result;
          } });setSpecies(Array);
      })();!(function () {
        $define(PROTO, ARRAY, { copyWithin: function copyWithin(target, start) {
            var O = Object(assertDefined(this)),
                len = toLength(O.length),
                to = toIndex(target, len),
                from = toIndex(start, len),
                end = arguments[2],
                fin = end === undefined ? len : toIndex(end, len),
                count = min(fin - from, len - to),
                inc = 1;if (from < to && to < from + count) {
              inc = -1;from = from + count - 1;to = to + count - 1;
            }while (count-- > 0) {
              if (from in O) O[to] = O[from];else delete O[to];to += inc;from += inc;
            }return O;
          }, fill: function fill(value) {
            var O = Object(assertDefined(this)),
                length = toLength(O.length),
                index = toIndex(arguments[1], length),
                end = arguments[2],
                endPos = end === undefined ? length : toIndex(end, length);while (endPos > index) O[index++] = value;return O;
          }, find: createArrayMethod(5), findIndex: createArrayMethod(6) });if (framework) {
          forEach.call(array("find,findIndex,fill,copyWithin,entries,keys,values"), function (it) {
            ArrayUnscopables[it] = true;
          });SYMBOL_UNSCOPABLES in ArrayProto || hidden(ArrayProto, SYMBOL_UNSCOPABLES, ArrayUnscopables);
        }
      })();!(function (at) {
        defineStdIterators(Array, ARRAY, function (iterated, kind) {
          set(this, ITER, { o: toObject(iterated), i: 0, k: kind });
        }, function () {
          var iter = this[ITER],
              O = iter.o,
              kind = iter.k,
              index = iter.i++;if (!O || index >= O.length) {
            iter.o = undefined;return iterResult(1);
          }if (kind == KEY) return iterResult(0, index);if (kind == VALUE) return iterResult(0, O[index]);return iterResult(0, [index, O[index]]);
        }, VALUE);Iterators[ARGUMENTS] = Iterators[ARRAY];defineStdIterators(String, STRING, function (iterated) {
          set(this, ITER, { o: String(iterated), i: 0 });
        }, function () {
          var iter = this[ITER],
              O = iter.o,
              index = iter.i,
              point;if (index >= O.length) return iterResult(1);point = at.call(O, index);iter.i += point.length;return iterResult(0, point);
        });
      })(createPointAt(true));DESC && !(function (RegExpProto, _RegExp) {
        if (!(function () {
          try {
            return RegExp(/a/g, "i") == "/a/i";
          } catch (e) {}
        })()) {
          RegExp = function RegExp(pattern, flags) {
            return new _RegExp(cof(pattern) == REGEXP && flags !== undefined ? pattern.source : pattern, flags);
          };forEach.call(getNames(_RegExp), function (key) {
            key in RegExp || defineProperty(RegExp, key, { configurable: true, get: function get() {
                return _RegExp[key];
              }, set: function set(it) {
                _RegExp[key] = it;
              } });
          });RegExpProto[CONSTRUCTOR] = RegExp;RegExp[PROTOTYPE] = RegExpProto;hidden(global, REGEXP, RegExp);
        }if (/./g.flags != "g") defineProperty(RegExpProto, "flags", { configurable: true, get: createReplacer(/^.*\/(\w*)$/, "$1") });setSpecies(RegExp);
      })(RegExp[PROTOTYPE], RegExp);isFunction(setImmediate) && isFunction(clearImmediate) || (function (ONREADYSTATECHANGE) {
        var postMessage = global.postMessage,
            addEventListener = global.addEventListener,
            MessageChannel = global.MessageChannel,
            counter = 0,
            queue = {},
            defer,
            channel,
            port;setImmediate = function (fn) {
          var args = [],
              i = 1;while (arguments.length > i) args.push(arguments[i++]);queue[++counter] = function () {
            invoke(isFunction(fn) ? fn : Function(fn), args);
          };defer(counter);return counter;
        };clearImmediate = function (id) {
          delete queue[id];
        };function run(id) {
          if (has(queue, id)) {
            var fn = queue[id];delete queue[id];fn();
          }
        }function listner(event) {
          run(event.data);
        }if (NODE) {
          defer = function (id) {
            nextTick(part.call(run, id));
          };
        } else if (addEventListener && isFunction(postMessage) && !global.importScripts) {
          defer = function (id) {
            postMessage(id, "*");
          };addEventListener("message", listner, false);
        } else if (isFunction(MessageChannel)) {
          channel = new MessageChannel();port = channel.port2;channel.port1.onmessage = listner;defer = ctx(port.postMessage, port, 1);
        } else if (document && ONREADYSTATECHANGE in document[CREATE_ELEMENT]("script")) {
          defer = function (id) {
            html.appendChild(document[CREATE_ELEMENT]("script"))[ONREADYSTATECHANGE] = function () {
              html.removeChild(this);run(id);
            };
          };
        } else {
          defer = function (id) {
            setTimeout(run, 0, id);
          };
        }
      })("onreadystatechange");$define(GLOBAL + BIND, { setImmediate: setImmediate, clearImmediate: clearImmediate });!(function (Promise, test) {
        isFunction(Promise) && isFunction(Promise.resolve) && Promise.resolve(test = new Promise(function () {})) == test || (function (asap, RECORD) {
          function isThenable(it) {
            var then;if (isObject(it)) then = it.then;return isFunction(then) ? then : false;
          }function handledRejectionOrHasOnRejected(promise) {
            var record = promise[RECORD],
                chain = record.c,
                i = 0,
                react;if (record.h) {
              return true;
            }while (chain.length > i) {
              react = chain[i++];if (react.fail || handledRejectionOrHasOnRejected(react.P)) {
                return true;
              }
            }
          }function notify(record, reject) {
            var chain = record.c;if (reject || chain.length) asap(function () {
              var promise = record.p,
                  value = record.v,
                  ok = record.s == 1,
                  i = 0;if (reject && !handledRejectionOrHasOnRejected(promise)) {
                setTimeout(function () {
                  if (!handledRejectionOrHasOnRejected(promise)) {
                    if (NODE) {
                      if (!process.emit("unhandledRejection", value, promise)) {}
                    } else if (isFunction(console.error)) {
                      console.error("Unhandled promise rejection", value);
                    }
                  }
                }, 1000);
              } else while (chain.length > i) !(function (react) {
                var cb = ok ? react.ok : react.fail,
                    ret,
                    then;try {
                  if (cb) {
                    if (!ok) record.h = true;ret = cb === true ? value : cb(value);if (ret === react.P) {
                      react.rej(TypeError(PROMISE + "-chain cycle"));
                    } else if (then = isThenable(ret)) {
                      then.call(ret, react.res, react.rej);
                    } else react.res(ret);
                  } else react.rej(value);
                } catch (err) {
                  react.rej(err);
                }
              })(chain[i++]);chain.length = 0;
            });
          }function resolve(value) {
            var record = this,
                then,
                wrapper;if (record.d) {
              return;
            }record.d = true;record = record.r || record;try {
              if (then = isThenable(value)) {
                wrapper = { r: record, d: false };then.call(value, ctx(resolve, wrapper, 1), ctx(reject, wrapper, 1));
              } else {
                record.v = value;record.s = 1;notify(record);
              }
            } catch (err) {
              reject.call(wrapper || { r: record, d: false }, err);
            }
          }function reject(value) {
            var record = this;if (record.d) {
              return;
            }record.d = true;record = record.r || record;record.v = value;record.s = 2;notify(record, true);
          }function getConstructor(C) {
            var S = assertObject(C)[SYMBOL_SPECIES];return S != undefined ? S : C;
          }Promise = function (executor) {
            assertFunction(executor);assertInstance(this, Promise, PROMISE);var record = { p: this, c: [], s: 0, d: false, v: undefined, h: false };hidden(this, RECORD, record);try {
              executor(ctx(resolve, record, 1), ctx(reject, record, 1));
            } catch (err) {
              reject.call(record, err);
            }
          };assignHidden(Promise[PROTOTYPE], { then: function then(onFulfilled, onRejected) {
              var S = assertObject(assertObject(this)[CONSTRUCTOR])[SYMBOL_SPECIES];var react = { ok: isFunction(onFulfilled) ? onFulfilled : true, fail: isFunction(onRejected) ? onRejected : false },
                  P = react.P = new (S != undefined ? S : Promise)(function (resolve, reject) {
                react.res = assertFunction(resolve);react.rej = assertFunction(reject);
              }),
                  record = this[RECORD];record.c.push(react);record.s && notify(record);return P;
            }, "catch": function _catch(onRejected) {
              return this.then(undefined, onRejected);
            } });assignHidden(Promise, { all: function all(iterable) {
              var Promise = getConstructor(this),
                  values = [];return new Promise(function (resolve, reject) {
                forOf(iterable, false, push, values);var remaining = values.length,
                    results = Array(remaining);if (remaining) forEach.call(values, function (promise, index) {
                  Promise.resolve(promise).then(function (value) {
                    results[index] = value;--remaining || resolve(results);
                  }, reject);
                });else resolve(results);
              });
            }, race: function race(iterable) {
              var Promise = getConstructor(this);return new Promise(function (resolve, reject) {
                forOf(iterable, false, function (promise) {
                  Promise.resolve(promise).then(resolve, reject);
                });
              });
            }, reject: function reject(r) {
              return new (getConstructor(this))(function (resolve, reject) {
                reject(r);
              });
            }, resolve: function resolve(x) {
              return isObject(x) && RECORD in x && getPrototypeOf(x) === this[PROTOTYPE] ? x : new (getConstructor(this))(function (resolve, reject) {
                resolve(x);
              });
            } });
        })(nextTick || setImmediate, safeSymbol("record"));setToStringTag(Promise, PROMISE);setSpecies(Promise);$define(GLOBAL + FORCED * !isNative(Promise), { Promise: Promise });
      })(global[PROMISE]);!(function () {
        var UID = safeSymbol("uid"),
            O1 = safeSymbol("O1"),
            WEAK = safeSymbol("weak"),
            LEAK = safeSymbol("leak"),
            LAST = safeSymbol("last"),
            FIRST = safeSymbol("first"),
            SIZE = DESC ? safeSymbol("size") : "size",
            uid = 0,
            tmp = {};function getCollection(C, NAME, methods, commonMethods, isMap, isWeak) {
          var ADDER = isMap ? "set" : "add",
              proto = C && C[PROTOTYPE],
              O = {};function initFromIterable(that, iterable) {
            if (iterable != undefined) forOf(iterable, isMap, that[ADDER], that);return that;
          }function fixSVZ(key, chain) {
            var method = proto[key];if (framework) proto[key] = function (a, b) {
              var result = method.call(this, a === 0 ? 0 : a, b);return chain ? this : result;
            };
          }if (!isNative(C) || !(isWeak || !BUGGY_ITERATORS && has(proto, FOR_EACH) && has(proto, "entries"))) {
            C = isWeak ? function (iterable) {
              assertInstance(this, C, NAME);set(this, UID, uid++);initFromIterable(this, iterable);
            } : function (iterable) {
              var that = this;assertInstance(that, C, NAME);set(that, O1, create(null));set(that, SIZE, 0);set(that, LAST, undefined);set(that, FIRST, undefined);initFromIterable(that, iterable);
            };assignHidden(assignHidden(C[PROTOTYPE], methods), commonMethods);isWeak || !DESC || defineProperty(C[PROTOTYPE], "size", { get: function get() {
                return assertDefined(this[SIZE]);
              } });
          } else {
            var Native = C,
                inst = new C(),
                chain = inst[ADDER](isWeak ? {} : -0, 1),
                buggyZero;if (checkDangerIterClosing(function (O) {
              new C(O);
            })) {
              C = function (iterable) {
                assertInstance(this, C, NAME);return initFromIterable(new Native(), iterable);
              };C[PROTOTYPE] = proto;if (framework) proto[CONSTRUCTOR] = C;
            }isWeak || inst[FOR_EACH](function (val, key) {
              buggyZero = 1 / key === -Infinity;
            });if (buggyZero) {
              fixSVZ("delete");fixSVZ("has");isMap && fixSVZ("get");
            }if (buggyZero || chain !== inst) fixSVZ(ADDER, true);
          }setToStringTag(C, NAME);setSpecies(C);O[NAME] = C;$define(GLOBAL + WRAP + FORCED * !isNative(C), O);isWeak || defineStdIterators(C, NAME, function (iterated, kind) {
            set(this, ITER, { o: iterated, k: kind });
          }, function () {
            var iter = this[ITER],
                kind = iter.k,
                entry = iter.l;while (entry && entry.r) entry = entry.p;if (!iter.o || !(iter.l = entry = entry ? entry.n : iter.o[FIRST])) {
              iter.o = undefined;return iterResult(1);
            }if (kind == KEY) return iterResult(0, entry.k);if (kind == VALUE) return iterResult(0, entry.v);return iterResult(0, [entry.k, entry.v]);
          }, isMap ? KEY + VALUE : VALUE, !isMap);return C;
        }function fastKey(it, create) {
          if (!isObject(it)) {
            return (typeof it == "string" ? "S" : "P") + it;
          }if (isFrozen(it)) {
            return "F";
          }if (!has(it, UID)) {
            if (!create) {
              return "E";
            }hidden(it, UID, ++uid);
          }return "O" + it[UID];
        }function getEntry(that, key) {
          var index = fastKey(key),
              entry;if (index != "F") {
            return that[O1][index];
          }for (entry = that[FIRST]; entry; entry = entry.n) {
            if (entry.k == key) {
              return entry;
            }
          }
        }function def(that, key, value) {
          var entry = getEntry(that, key),
              prev,
              index;if (entry) entry.v = value;else {
            that[LAST] = entry = { i: index = fastKey(key, true), k: key, v: value, p: prev = that[LAST], n: undefined, r: false };if (!that[FIRST]) that[FIRST] = entry;if (prev) prev.n = entry;that[SIZE]++;if (index != "F") that[O1][index] = entry;
          }return that;
        }var collectionMethods = { clear: function clear() {
            for (var that = this, data = that[O1], entry = that[FIRST]; entry; entry = entry.n) {
              entry.r = true;
              if (entry.p) entry.p = entry.p.n = undefined;delete data[entry.i];
            }that[FIRST] = that[LAST] = undefined;that[SIZE] = 0;
          }, "delete": function _delete(key) {
            var that = this,
                entry = getEntry(that, key);if (entry) {
              var next = entry.n,
                  prev = entry.p;delete that[O1][entry.i];entry.r = true;if (prev) prev.n = next;if (next) next.p = prev;if (that[FIRST] == entry) that[FIRST] = next;if (that[LAST] == entry) that[LAST] = prev;that[SIZE]--;
            }return !!entry;
          }, forEach: function forEach(callbackfn) {
            var f = ctx(callbackfn, arguments[1], 3),
                entry;while (entry = entry ? entry.n : this[FIRST]) {
              f(entry.v, entry.k, this);while (entry && entry.r) entry = entry.p;
            }
          }, has: function has(key) {
            return !!getEntry(this, key);
          } };Map = getCollection(Map, MAP, { get: function get(key) {
            var entry = getEntry(this, key);return entry && entry.v;
          }, set: function set(key, value) {
            return def(this, key === 0 ? 0 : key, value);
          } }, collectionMethods, true);Set = getCollection(Set, SET, { add: function add(value) {
            return def(this, value = value === 0 ? 0 : value, value);
          } }, collectionMethods);function defWeak(that, key, value) {
          if (isFrozen(assertObject(key))) leakStore(that).set(key, value);else {
            has(key, WEAK) || hidden(key, WEAK, {});key[WEAK][that[UID]] = value;
          }return that;
        }function leakStore(that) {
          return that[LEAK] || hidden(that, LEAK, new Map())[LEAK];
        }var weakMethods = { "delete": function _delete(key) {
            if (!isObject(key)) {
              return false;
            }if (isFrozen(key)) {
              return leakStore(this)["delete"](key);
            }return has(key, WEAK) && has(key[WEAK], this[UID]) && delete key[WEAK][this[UID]];
          }, has: (function (_has) {
            var _hasWrapper = function has(_x) {
              return _has.apply(this, arguments);
            };

            _hasWrapper.toString = function () {
              return _has.toString();
            };

            return _hasWrapper;
          })(function (key) {
            if (!isObject(key)) return false;if (isFrozen(key)) return leakStore(this).has(key);return has(key, WEAK) && has(key[WEAK], this[UID]);
          }) };WeakMap = getCollection(WeakMap, WEAKMAP, { get: function get(key) {
            if (isObject(key)) {
              if (isFrozen(key)) {
                return leakStore(this).get(key);
              }if (has(key, WEAK)) {
                return key[WEAK][this[UID]];
              }
            }
          }, set: function set(key, value) {
            return defWeak(this, key, value);
          } }, weakMethods, true, true);if (framework && new WeakMap().set(Object.freeze(tmp), 7).get(tmp) != 7) {
          forEach.call(array("delete,has,get,set"), function (key) {
            var method = WeakMap[PROTOTYPE][key];WeakMap[PROTOTYPE][key] = function (a, b) {
              if (isObject(a) && isFrozen(a)) {
                var result = leakStore(this)[key](a, b);return key == "set" ? this : result;
              }return method.call(this, a, b);
            };
          });
        }WeakSet = getCollection(WeakSet, WEAKSET, { add: function add(value) {
            return defWeak(this, value, true);
          } }, weakMethods, false, true);
      })();!(function () {
        function Enumerate(iterated) {
          var keys = [],
              key;for (key in iterated) keys.push(key);set(this, ITER, { o: iterated, a: keys, i: 0 });
        }createIterator(Enumerate, OBJECT, function () {
          var iter = this[ITER],
              keys = iter.a,
              key;do {
            if (iter.i >= keys.length) return iterResult(1);
          } while (!((key = keys[iter.i++]) in iter.o));return iterResult(0, key);
        });function wrap(fn) {
          return function (it) {
            assertObject(it);try {
              return (fn.apply(undefined, arguments), true);
            } catch (e) {
              return false;
            }
          };
        }function reflectGet(_x, _x2) {
          var _arguments = arguments;
          var _again = true;

          _function: while (_again) {
            _again = false;
            var target = _x,
                propertyKey = _x2;
            receiver = desc = proto = undefined;
            var receiver = _arguments.length < 3 ? target : _arguments[2],
                desc = getOwnDescriptor(assertObject(target), propertyKey),
                proto;if (desc) {
              return has(desc, "value") ? desc.value : desc.get === undefined ? undefined : desc.get.call(receiver);
            }if (isObject(proto = getPrototypeOf(target))) {
              _arguments = [_x = proto, _x2 = propertyKey, receiver];
              _again = true;
              continue _function;
            } else {
              return undefined;
            }
          }
        }function reflectSet(_x, _x2, _x3) {
          var _arguments = arguments;
          var _again = true;

          _function: while (_again) {
            _again = false;
            var target = _x,
                propertyKey = _x2,
                V = _x3;
            receiver = ownDesc = existingDescriptor = proto = undefined;
            var receiver = _arguments.length < 4 ? target : _arguments[3],
                ownDesc = getOwnDescriptor(assertObject(target), propertyKey),
                existingDescriptor,
                proto;if (!ownDesc) {
              if (isObject(proto = getPrototypeOf(target))) {
                _arguments = [_x = proto, _x2 = propertyKey, _x3 = V, receiver];
                _again = true;
                continue _function;
              }ownDesc = descriptor(0);
            }if (has(ownDesc, "value")) {
              if (ownDesc.writable === false || !isObject(receiver)) {
                return false;
              }existingDescriptor = getOwnDescriptor(receiver, propertyKey) || descriptor(0);existingDescriptor.value = V;return (defineProperty(receiver, propertyKey, existingDescriptor), true);
            }return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
          }
        }var isExtensible = Object.isExtensible || returnIt;var reflect = { apply: ctx(call, apply, 3), construct: function construct(target, argumentsList) {
            var proto = assertFunction(arguments.length < 3 ? target : arguments[2])[PROTOTYPE],
                instance = create(isObject(proto) ? proto : ObjectProto),
                result = apply.call(target, instance, argumentsList);return isObject(result) ? result : instance;
          }, defineProperty: wrap(defineProperty), deleteProperty: function deleteProperty(target, propertyKey) {
            var desc = getOwnDescriptor(assertObject(target), propertyKey);return desc && !desc.configurable ? false : delete target[propertyKey];
          }, enumerate: function enumerate(target) {
            return new Enumerate(assertObject(target));
          }, get: reflectGet, getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
            return getOwnDescriptor(assertObject(target), propertyKey);
          }, getPrototypeOf: (function (_getPrototypeOf) {
            var _getPrototypeOfWrapper = function getPrototypeOf(_x) {
              return _getPrototypeOf.apply(this, arguments);
            };

            _getPrototypeOfWrapper.toString = function () {
              return _getPrototypeOf.toString();
            };

            return _getPrototypeOfWrapper;
          })(function (target) {
            return getPrototypeOf(assertObject(target));
          }), has: function has(target, propertyKey) {
            return propertyKey in target;
          }, isExtensible: (function (_isExtensible) {
            var _isExtensibleWrapper = function isExtensible(_x) {
              return _isExtensible.apply(this, arguments);
            };

            _isExtensibleWrapper.toString = function () {
              return _isExtensible.toString();
            };

            return _isExtensibleWrapper;
          })(function (target) {
            return !!isExtensible(assertObject(target));
          }), ownKeys: ownKeys, preventExtensions: wrap(Object.preventExtensions || returnIt), set: reflectSet };if (setPrototypeOf) reflect.setPrototypeOf = function (target, proto) {
          return (setPrototypeOf(assertObject(target), proto), true);
        };$define(GLOBAL, { Reflect: {} });$define(STATIC, "Reflect", reflect);
      })();!(function () {
        $define(PROTO, ARRAY, { includes: createArrayContains(true) });$define(PROTO, STRING, { at: createPointAt(true) });function createObjectToArray(isEntries) {
          return function (object) {
            var O = toObject(object),
                keys = getKeys(object),
                length = keys.length,
                i = 0,
                result = Array(length),
                key;if (isEntries) while (length > i) result[i] = [key = keys[i++], O[key]];else while (length > i) result[i] = O[keys[i++]];return result;
          };
        }$define(STATIC, OBJECT, { getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
            var O = toObject(object),
                result = {};forEach.call(ownKeys(O), function (key) {
              defineProperty(result, key, descriptor(0, getOwnDescriptor(O, key)));
            });return result;
          }, values: createObjectToArray(false), entries: createObjectToArray(true) });$define(STATIC, REGEXP, { escape: createReplacer(/([\\\-[\]{}()*+?.,^$|])/g, "\\$1", true) });
      })();!(function (REFERENCE) {
        REFERENCE_GET = getWellKnownSymbol(REFERENCE + "Get", true);var REFERENCE_SET = getWellKnownSymbol(REFERENCE + SET, true),
            REFERENCE_DELETE = getWellKnownSymbol(REFERENCE + "Delete", true);$define(STATIC, SYMBOL, { referenceGet: REFERENCE_GET, referenceSet: REFERENCE_SET, referenceDelete: REFERENCE_DELETE });hidden(FunctionProto, REFERENCE_GET, returnThis);function setMapMethods(Constructor) {
          if (Constructor) {
            var MapProto = Constructor[PROTOTYPE];hidden(MapProto, REFERENCE_GET, MapProto.get);hidden(MapProto, REFERENCE_SET, MapProto.set);hidden(MapProto, REFERENCE_DELETE, MapProto["delete"]);
          }
        }setMapMethods(Map);setMapMethods(WeakMap);
      })("reference");!(function (arrayStatics) {
        function setArrayStatics(keys, length) {
          forEach.call(array(keys), function (key) {
            if (key in ArrayProto) arrayStatics[key] = ctx(call, ArrayProto[key], length);
          });
        }setArrayStatics("pop,reverse,shift,keys,values,entries", 1);setArrayStatics("indexOf,every,some,forEach,map,filter,find,findIndex,includes", 3);setArrayStatics("join,slice,concat,push,splice,unshift,sort,lastIndexOf," + "reduce,reduceRight,copyWithin,fill,turn");$define(STATIC, ARRAY, arrayStatics);
      })({});!(function (NodeList) {
        if (framework && NodeList && !(SYMBOL_ITERATOR in NodeList[PROTOTYPE])) {
          hidden(NodeList[PROTOTYPE], SYMBOL_ITERATOR, Iterators[ARRAY]);
        }Iterators.NodeList = Iterators[ARRAY];
      })(global.NodeList);
    })(typeof self != "undefined" && self.Math === Math ? self : Function("return this")(), true);
  }, {}], 3: [function (require, module, exports) {
    (function (global) {
      !(function (global) {
        "use strict";var hasOwn = Object.prototype.hasOwnProperty;var undefined;var iteratorSymbol = typeof Symbol === "function" && Symbol.iterator || "@@iterator";var inModule = typeof module === "object";var runtime = global.regeneratorRuntime;if (runtime) {
          if (inModule) {
            module.exports = runtime;
          }return;
        }runtime = global.regeneratorRuntime = inModule ? module.exports : {};function wrap(innerFn, outerFn, self, tryLocsList) {
          return new Generator(innerFn, outerFn, self || null, tryLocsList || []);
        }runtime.wrap = wrap;function tryCatch(fn, obj, arg) {
          try {
            return { type: "normal", arg: fn.call(obj, arg) };
          } catch (err) {
            return { type: "throw", arg: err };
          }
        }var GenStateSuspendedStart = "suspendedStart";var GenStateSuspendedYield = "suspendedYield";var GenStateExecuting = "executing";var GenStateCompleted = "completed";var ContinueSentinel = {};function GeneratorFunction() {}function GeneratorFunctionPrototype() {}var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;GeneratorFunctionPrototype.constructor = GeneratorFunction;GeneratorFunction.displayName = "GeneratorFunction";runtime.isGeneratorFunction = function (genFun) {
          var ctor = typeof genFun === "function" && genFun.constructor;return ctor ? ctor === GeneratorFunction || (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
        };runtime.mark = function (genFun) {
          genFun.__proto__ = GeneratorFunctionPrototype;genFun.prototype = Object.create(Gp);return genFun;
        };runtime.async = function (innerFn, outerFn, self, tryLocsList) {
          return new Promise(function (resolve, reject) {
            var generator = wrap(innerFn, outerFn, self, tryLocsList);var callNext = step.bind(generator.next);var callThrow = step.bind(generator["throw"]);function step(arg) {
              var record = tryCatch(this, null, arg);if (record.type === "throw") {
                reject(record.arg);return;
              }var info = record.arg;if (info.done) {
                resolve(info.value);
              } else {
                Promise.resolve(info.value).then(callNext, callThrow);
              }
            }callNext();
          });
        };function Generator(innerFn, outerFn, self, tryLocsList) {
          var generator = outerFn ? Object.create(outerFn.prototype) : this;var context = new Context(tryLocsList);var state = GenStateSuspendedStart;function invoke(method, arg) {
            if (state === GenStateExecuting) {
              throw new Error("Generator is already running");
            }if (state === GenStateCompleted) {
              return doneResult();
            }while (true) {
              var delegate = context.delegate;if (delegate) {
                var record = tryCatch(delegate.iterator[method], delegate.iterator, arg);if (record.type === "throw") {
                  context.delegate = null;method = "throw";arg = record.arg;continue;
                }method = "next";arg = undefined;var info = record.arg;if (info.done) {
                  context[delegate.resultName] = info.value;context.next = delegate.nextLoc;
                } else {
                  state = GenStateSuspendedYield;return info;
                }context.delegate = null;
              }if (method === "next") {
                if (state === GenStateSuspendedStart && typeof arg !== "undefined") {
                  throw new TypeError("attempt to send " + JSON.stringify(arg) + " to newborn generator");
                }if (state === GenStateSuspendedYield) {
                  context.sent = arg;
                } else {
                  delete context.sent;
                }
              } else if (method === "throw") {
                if (state === GenStateSuspendedStart) {
                  state = GenStateCompleted;throw arg;
                }if (context.dispatchException(arg)) {
                  method = "next";arg = undefined;
                }
              } else if (method === "return") {
                context.abrupt("return", arg);
              }state = GenStateExecuting;var record = tryCatch(innerFn, self, context);if (record.type === "normal") {
                state = context.done ? GenStateCompleted : GenStateSuspendedYield;var info = { value: record.arg, done: context.done };if (record.arg === ContinueSentinel) {
                  if (context.delegate && method === "next") {
                    arg = undefined;
                  }
                } else {
                  return info;
                }
              } else if (record.type === "throw") {
                state = GenStateCompleted;if (method === "next") {
                  context.dispatchException(record.arg);
                } else {
                  arg = record.arg;
                }
              }
            }
          }generator.next = invoke.bind(generator, "next");generator["throw"] = invoke.bind(generator, "throw");generator["return"] = invoke.bind(generator, "return");return generator;
        }Gp[iteratorSymbol] = function () {
          return this;
        };Gp.toString = function () {
          return "[object Generator]";
        };function pushTryEntry(locs) {
          var entry = { tryLoc: locs[0] };if (1 in locs) {
            entry.catchLoc = locs[1];
          }if (2 in locs) {
            entry.finallyLoc = locs[2];entry.afterLoc = locs[3];
          }this.tryEntries.push(entry);
        }function resetTryEntry(entry) {
          var record = entry.completion || {};record.type = "normal";delete record.arg;entry.completion = record;
        }function Context(tryLocsList) {
          this.tryEntries = [{ tryLoc: "root" }];tryLocsList.forEach(pushTryEntry, this);this.reset();
        }runtime.keys = function (object) {
          var keys = [];for (var key in object) {
            keys.push(key);
          }keys.reverse();return function next() {
            while (keys.length) {
              var key = keys.pop();if (key in object) {
                next.value = key;next.done = false;return next;
              }
            }next.done = true;return next;
          };
        };function values(iterable) {
          if (iterable) {
            var iteratorMethod = iterable[iteratorSymbol];if (iteratorMethod) {
              return iteratorMethod.call(iterable);
            }if (typeof iterable.next === "function") {
              return iterable;
            }if (!isNaN(iterable.length)) {
              var i = -1,
                  next = function next() {
                while (++i < iterable.length) {
                  if (hasOwn.call(iterable, i)) {
                    next.value = iterable[i];next.done = false;return next;
                  }
                }next.value = undefined;next.done = true;return next;
              };return next.next = next;
            }
          }return { next: doneResult };
        }runtime.values = values;function doneResult() {
          return { value: undefined, done: true };
        }Context.prototype = { constructor: Context, reset: function reset() {
            this.prev = 0;this.next = 0;this.sent = undefined;this.done = false;this.delegate = null;this.tryEntries.forEach(resetTryEntry);for (var tempIndex = 0, tempName; hasOwn.call(this, tempName = "t" + tempIndex) || tempIndex < 20; ++tempIndex) {
              this[tempName] = null;
            }
          }, stop: function stop() {
            this.done = true;var rootEntry = this.tryEntries[0];var rootRecord = rootEntry.completion;if (rootRecord.type === "throw") {
              throw rootRecord.arg;
            }return this.rval;
          }, dispatchException: function dispatchException(exception) {
            if (this.done) {
              throw exception;
            }var context = this;function handle(loc, caught) {
              record.type = "throw";record.arg = exception;context.next = loc;return !!caught;
            }for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];var record = entry.completion;if (entry.tryLoc === "root") {
                return handle("end");
              }if (entry.tryLoc <= this.prev) {
                var hasCatch = hasOwn.call(entry, "catchLoc");var hasFinally = hasOwn.call(entry, "finallyLoc");if (hasCatch && hasFinally) {
                  if (this.prev < entry.catchLoc) {
                    return handle(entry.catchLoc, true);
                  } else if (this.prev < entry.finallyLoc) {
                    return handle(entry.finallyLoc);
                  }
                } else if (hasCatch) {
                  if (this.prev < entry.catchLoc) {
                    return handle(entry.catchLoc, true);
                  }
                } else if (hasFinally) {
                  if (this.prev < entry.finallyLoc) {
                    return handle(entry.finallyLoc);
                  }
                } else {
                  throw new Error("try statement without catch or finally");
                }
              }
            }
          }, abrupt: function abrupt(type, arg) {
            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
                var finallyEntry = entry;break;
              }
            }if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg < finallyEntry.finallyLoc) {
              finallyEntry = null;
            }var record = finallyEntry ? finallyEntry.completion : {};record.type = type;record.arg = arg;if (finallyEntry) {
              this.next = finallyEntry.finallyLoc;
            } else {
              this.complete(record);
            }return ContinueSentinel;
          }, complete: function complete(record, afterLoc) {
            if (record.type === "throw") {
              throw record.arg;
            }if (record.type === "break" || record.type === "continue") {
              this.next = record.arg;
            } else if (record.type === "return") {
              this.rval = record.arg;this.next = "end";
            } else if (record.type === "normal" && afterLoc) {
              this.next = afterLoc;
            }return ContinueSentinel;
          }, finish: function finish(finallyLoc) {
            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];if (entry.finallyLoc === finallyLoc) {
                return this.complete(entry.completion, entry.afterLoc);
              }
            }
          }, "catch": function _catch(tryLoc) {
            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];if (entry.tryLoc === tryLoc) {
                var record = entry.completion;if (record.type === "throw") {
                  var thrown = record.arg;resetTryEntry(entry);
                }return thrown;
              }
            }throw new Error("illegal catch attempt");
          }, delegateYield: function delegateYield(iterable, resultName, nextLoc) {
            this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc };return ContinueSentinel;
          } };
      })(typeof global === "object" ? global : typeof window === "object" ? window : this);
    }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
  }, {}] }, {}, [1]);
//# sourceMappingURL=browser-polyfill.js.map
"use strict";

define(function () {

	function highlighter(elm) {
		if (typeof elm === "string") {
			elm = document.querySelector(elm);
		}
		if (elm) {
			elm.className += " utt-highlight";
		}
	}

	highlighter.find = function (selector) {
		return document.querySelectorAll(selector);
	};

	highlighter.removeHighlight = function () {
		Array.from(document.querySelectorAll(".utt-highlight")).forEach(function (elm) {
			elm.className = elm.className.replace(/utt-highlight/, "").trim();
		});
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
"use strict";

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

define(["./browser-polyfill"], function () {
    var translator = undefined;

    // Matches optional type annotations in i18n strings.
    // e.g. i18n`This is a number ${x}:n(2)` formats x as number
    //      with two fractional digits.
    var typeInfoRegex = /^:([a-z])(\((.+)\))?/;

    translator = function (_ref) {
        var locale = _ref.locale;
        var defaultCurrency = _ref.defaultCurrency;
        var messageBundle = _ref.messageBundle;

        return function (literals) {
            for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                values[_key - 1] = arguments[_key];
            }

            if (!Array.isArray(literals)) {
                literals = [literals];
            }
            var translationKey = translator.buildKey(literals);
            var translationString = messageBundle[translationKey];

            if (translationString) {
                var _ret = (function () {
                    var typeInfoForValues = literals.slice(1).map(translator.extractTypeInfo);
                    var localizedValues = values.map(function (v, i) {
                        return translator.localize(locale, v, typeInfoForValues[i]);
                    });
                    return {
                        v: translator.buildMessage.apply(translator, [translationString].concat(_toConsumableArray(localizedValues)))
                    };
                })();

                if (typeof _ret === "object") return _ret.v;
            }

            if (translator.logging) {
                console.warn("Translation missing '" + translationKey + "'");
            }

            return translationKey;
        };
    };

    Object.assign(translator, {
        defaultCurrency: "EURO",
        logging: true,
        localizers: {
            /*string*/
            s: function (locale, v) {
                return v.toLocaleString(locale);
            },

            /*currency*/
            c: function (locale, v, currency) {
                return v.toLocaleString(locale, {
                    style: "currency",
                    currency: currency || translator.defaultCurrency
                });
            },

            /*number*/
            n: function (locale, v, fractionalDigits) {
                return v.toLocaleString(locale, {
                    minimumFractionDigits: fractionalDigits,
                    maximumFractionDigits: fractionalDigits
                });
            }
        },

        buildKey: function buildKey(literals) {
            var stripType = function (s) {
                return s.replace(typeInfoRegex, "");
            };
            var lastPartialKey = stripType(literals[literals.length - 1]);
            var prependPartialKey = function (memo, curr, i) {
                return "" + stripType(curr) + "{" + i + "}" + memo;
            };

            return literals.slice(0, -1).reduceRight(prependPartialKey, lastPartialKey);
        },

        extractTypeInfo: function extractTypeInfo(literal) {
            var match = typeInfoRegex.exec(literal);
            if (match) {
                return { type: match[1], options: match[3] };
            } else {
                return { type: "s", options: "" };
            }
        },

        localize: function localize(locale, value, _ref) {
            var type = _ref.type;
            var options = _ref.options;

            return translator.localizers[type](locale, value, options);
        },

        buildMessage: function buildMessage(str) {
            for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                values[_key - 1] = arguments[_key];
            }

            return str.replace(/{(\d)}/g, function (_, index) {
                return values[Number(index)];
            });
        }
    });

    return translator;
});
//# sourceMappingURL=translator.js.map