define(['React'],
function (React) {

    let i18n;

    let ReportDetails = React.createClass({
        propTypes: {
            i18n:     React.PropTypes.func.isRequired,
            category:  React.PropTypes.object.isRequired,
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
            console.log(category);
            let assertion = category.assertions[this.state.currAssert];

            console.log(assertion);

            // Show a description of the test
            return <div>
                {this.renderTop()}
                <p>{assertion.result.outcome}</p>
                <p>L Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                Aenean commodo ligula eget dolor. Aenean massa. Cum sociis
                natoque penatibus et magnis dis parturient montes, nascetur
                ridiculus mus. Donec quam felis, ultricies nec, pellentesque
                eu, pretium quis, sem. Nulla consequat massa quis enim.</p>

                {this.renderPagination()}
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
            return <div>
                <h1>
                    <img src={imgSrc} width="30" height="30"
                     alt="" role="presentation" />
                    {i18n`Results`}
                </h1>
                <h2>{this.props.category.title}</h2>
                <a href="#" onClick={this.props.showList}>
                    {i18n`Back to result list`}
                </a>
            </div>;
        },

        /**
         * Render a pagination component
         * @return {React object}
         */
        renderPagination() {
            let assertions = this.props.category.assertions;
            let currAssert = this.state.currAssert;
            if (assertions.length <= 1) {
                return;
            }

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

            let nextClick = this.changeAssert.bind(
                   this, (currAssert + 1) % assertions.length);

            return <div>
                <button onClick={nextClick}>
                    {i18n`next`}
                </button>
                <ul className="pagination">
                    {numberings}
                </ul>
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
        }

    });

    return ReportDetails;

});
