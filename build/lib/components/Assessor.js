"use strict";

define(["React", "./UttModule", "UTT/utils/i18n"], function (React, UttModule, i18n) {

    var Assessor = React.createClass({ displayName: "Assessor",
        render: function render() {
            var q = this.props.question;
            return React.createElement(UttModule, { className: "assessor" }, q ? this.renderQuestion(q) : this.renderNoQuestion());
        },

        renderQuestion: function renderQuestion(q) {
            return React.createElement("div", null, this.renderModuleHead(), React.createElement("div", { className: "content" }, React.createElement("h3", null, i18n((function () {
                var siteObj = ["Question ", ""];siteObj.raw = ["Question ", ""];Object.freeze(siteObj.raw);Object.freeze(siteObj);return siteObj;
            })(), this.props.current)), React.createElement("p", null, q.text), React.createElement("p", null, React.createElement("a", { href: "", onClick: this.toggleHelp }, i18n((function () {
                var siteObj = ["More information"];siteObj.raw = ["More information"];Object.freeze(siteObj.raw);Object.freeze(siteObj);return siteObj;
            })()))), React.createElement("p", { className: this.state.showHelp ? "show" : "hide" }, q.help), q.answers.map((function (answer, i) {
                return React.createElement("button", { key: i, onClick: this.props.sendResult.bind(null, answer.value) }, answer.text);
            }).bind(this))));
        },

        renderModuleHead: function renderModuleHead() {
            var perc = (this.props.current - 1) / this.props.total * 100;

            return React.createElement("div", { className: "module-head" }, React.createElement("h2", null, "HEAD"), React.createElement("img", { src: "", width: "48", height: "48", alt: "" }), React.createElement("p", null, "TEXT"), React.createElement("div", { className: "progress-bar" }, React.createElement("span", { className: "label" }, this.props.current + " / " + this.props.total), React.createElement("span", { className: "bar", style: { width: perc + "%" } })));
        },

        renderNoQuestion: function renderNoQuestion() {
            return React.createElement("div", null, i18n((function () {
                var siteObj = ["No question"];siteObj.raw = ["No question"];Object.freeze(siteObj.raw);Object.freeze(siteObj);return siteObj;
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