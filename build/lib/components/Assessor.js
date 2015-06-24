"use strict";

define(["React", "./UttModule"], function (React, UttModule) {

    var i18n = undefined;

    var Assessor = React.createClass({ displayName: "Assessor",
        render: function render() {
            i18n = this.props.i18n;
            var q = this.props.question;
            return React.createElement(UttModule, { className: "assessor", i18n: i18n }, q ? this.renderQuestion(q) : this.renderNoQuestion());
        },

        renderQuestion: function renderQuestion(q) {
            var showHelp = this.state.showHelp ? "show" : "hide";
            return React.createElement("div", null, this.renderModuleHead(), React.createElement("div", { className: "content" }, React.createElement("h3", null, i18n((function () {
                var siteObj = ["question ", ""];siteObj.raw = ["question ", ""];Object.freeze(siteObj.raw);Object.freeze(siteObj);return siteObj;
            })(), this.props.current)), React.createElement("p", null, q.text), React.createElement("p", null, React.createElement("a", { href: "", onClick: this.toggleHelp }, i18n((function () {
                var siteObj = ["more information"];siteObj.raw = ["more information"];Object.freeze(siteObj.raw);Object.freeze(siteObj);return siteObj;
            })()))), React.createElement("p", { className: showHelp }, q.help), q.answers.map((function (answer, i) {
                return React.createElement("button", { key: i, onClick: this.props.sendResult.bind(null, answer.value) }, i18n(answer.text));
            }).bind(this))));
        },

        renderModuleHead: function renderModuleHead() {
            var perc = (this.props.current - 1) / this.props.total * 100;

            return React.createElement("div", { className: "module-head" }, React.createElement("h2", null, i18n((function () {
                var siteObj = ["CATG_TITLE"];siteObj.raw = ["CATG_TITLE"];Object.freeze(siteObj.raw);Object.freeze(siteObj);return siteObj;
            })())), React.createElement("img", { src: this.props.iconSrc, width: "48", height: "48",
                alt: "", role: "presentation" }), React.createElement("p", null, i18n((function () {
                var siteObj = ["CATG_DESCR"];siteObj.raw = ["CATG_DESCR"];Object.freeze(siteObj.raw);Object.freeze(siteObj);return siteObj;
            })())), React.createElement("div", { className: "progress-bar" }, React.createElement("span", { className: "label" }, this.props.current + " / " + this.props.total), React.createElement("span", { className: "bar", style: {
                    width: perc + "%"
                } })));
        },

        renderNoQuestion: function renderNoQuestion() {
            return React.createElement("div", null, i18n((function () {
                var siteObj = ["no question"];siteObj.raw = ["no question"];Object.freeze(siteObj.raw);Object.freeze(siteObj);return siteObj;
            })()));
        },

        getInitialState: function getInitialState() {
            return { showHelp: false };
        },

        toggleHelp: function toggleHelp(e) {
            e.preventDefault();
            this.setState({
                showHelp: !this.state.showHelp
            });
        }

    });
    return Assessor;
});
//# sourceMappingURL=Assessor.js.map