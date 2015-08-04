define(['React'],
function (React) {

    let i18n;

    let ReportDetails = React.createClass({
        propTypes: {
            i18n: React.PropTypes.func.isRequired,
            details: React.PropTypes.object.isRequired,
            showList: React.PropTypes.func.isRequired
        },

        getInitialState() {
            return {
                currResult:0
            };
        },

        render() {
            i18n  = this.props.i18n;
            // Show a description of the test
            return <div>
                {this.renderTop()}
                <p>L Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                Aenean commodo ligula eget dolor. Aenean massa. Cum sociis
                natoque penatibus et magnis dis parturient montes, nascetur
                ridiculus mus. Donec quam felis, ultricies nec, pellentesque
                eu, pretium quis, sem. Nulla consequat massa quis enim.</p>
                <div>
                  <button>{i18n`previous`}</button>
                  <button>{i18n`next`}</button>
                </div>

                {this.renderPagination()}
            </div>;
        },

        /**
         * Render the category and description of the test
         * @return {React object}
         */
        renderTop() {
            return <div>
                <h1>
                  <img src="" alt="" width="30" height="30" />
                  {i18n`Results`}
                </h1>
                <h2>CATEGORIE</h2>
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
            let results = this.props.details.results;
            if (results.length <= 1) {
                return;
            }

            return <ul className="pagination">
                {results.map((result, i) => {
                    let item;
                    if (this.state.currResult !== i) {
                        item = <a href="#" onClick={this.changeResult.bind(this, i)}>
                            {i+1}
                        </a>;
                    } else {
                        item = <a>{i+1}</a>;
                    }

                    return <li key={i}>{item}</li>;
                })}
            </ul>;
        },

        /**
         * Change the result currently displayed
         * @param  {int}    resNum
         * @param  {object} event
         */
        changeResult(resNum, e) {
            this.setState({currResult: resNum});
            if (typeof e === 'object' && e.preventDefault) {
                e.preventDefault();
            }
        }
    });

    return ReportDetails;

});
