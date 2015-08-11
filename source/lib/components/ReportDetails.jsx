define(['React', 'UTT/utils/highlighter'],
function (React, highlighter) {

    let i18n;

    let ReportDetails = React.createClass({
        propTypes: {
            i18n:     React.PropTypes.func.isRequired,
            category: React.PropTypes.object.isRequired,
            showList: React.PropTypes.func.isRequired
        },

        getInitialState() {
            return {
                currAssert:0
            };
        },

        render() {
            i18n          = this.props.i18n;
            let category  = this.props.category;
            let assertion = category.assertions[this.state.currAssert];

            highlighter.removeHighlight();
            let cssSelector = assertion.result.pointer.expression;
            let elms = highlighter.find(cssSelector);
            highlighter(elms[0]);

            // Show a description of the test
            return <div className="content">
                {this.renderTop()}
                <p>{[
                    this.renderResultIcon(assertion),
                    assertion.test.title || i18n`No label available`
                ]}</p>
                <p className="utt-report-description">{
                    assertion.test.description ||
                    i18n`No label available`
                }</p>
                {this.renderNavigation()}
            </div>;
        },

        /**
         * Render the category and description of the test
         * @return {React object}
         */
        renderTop() {
            let imgSrc = require.toUrl(
                            'UTT/components/assets/images/' +
                            this.props.category.icon);
            return <h1 className="utt-title">
                <img src={imgSrc} width="30" height="30"
                 alt="" role="presentation" />
                {i18n`Results for` +' '+ this.props.category.title}
            </h1>;
        },

        /**
         * Render a pagination component
         * @return {React object}
         */
        renderNavigation() {
            let assertions = this.props.category.assertions;
            let currAssert = this.state.currAssert;

            let button, pagination;
            // Only include next button / pagination with more then
            // one result
            if (assertions.length > 1) {
                // create an li for each result, without link for the
                // current result
                let numberings = assertions.map((assertion, i) => {
                    let item;
                    if (this.state.currAssert !== i) {
                        let click = this.changeAssert.bind(this, i);
                        item = <a href="#" onClick={click}>{i+1}</a>;

                    } else {
                        item = <span>{i+1}</span>;
                    }
                    return <li key={i}>{item}</li>;
                });

                // define the 'next' button
                let nextClick = this.changeAssert.bind(
                       this, (currAssert + 1) % assertions.length);
                button = <button onClick={nextClick}>
                    {i18n`next`}
                </button>;

                // Define the pagination list
                pagination = <ul className="utt-pagination">
                    {numberings}
                </ul>;
            }

            return <div>
                {button} {pagination}
                <p><a href="#" onClick={this.props.showList}>
                    {i18n`Back to result list`}
                </a></p>
            </div>;
        },

        /**
         * Change the assertion currently displayed
         * @param  {int}    resNum
         * @param  {object} event
         */
        changeAssert(resNum, e) {
            this.setState({currAssert: resNum});
            if (typeof e === 'object' && e.preventDefault) {
                e.preventDefault();
            }
        },

        renderResultIcon(assertion) {
            let outcome = assertion.result.outcome.replace('earl:', '');
            let imgPath = `UTT/components/assets/images/earl-${outcome}.svg`;
            return <img src={require.toUrl(imgPath)}
                    alt={i18n(outcome)} title={i18n(outcome)}
                    width="30" height="30" />;
        },

        componentWillUnmount() {
            highlighter.removeHighlight();
        }

    });

    return ReportDetails;

});
