define(['React', './UttModule',  './ModuleList', './ReportDetails'],
function (React, UttModule, ModuleList, ReportDetails) {

    let i18n;

	let Reporter = React.createClass({
        propTypes: {
            i18n:       React.PropTypes.func.isRequired,
            categories: React.PropTypes.array.isRequired,
        },

        getInitialState() {
            return { details: -1 };
        },

        render() {
            i18n  = this.props.i18n;
            return <UttModule className="reporter" i18n={i18n}>
                <h1>{i18n`Results list`}</h1>
                {(this.state.details === -1 ? this.renderList()
                                      : this.renderDetails(this.state.details) )}
            </UttModule>;
        },

        renderList() {
            let categories = this.props.categories;
            return <ModuleList
                    openModule={this.openModule}
                    modules={categories} i18n={i18n} />;
        },

        renderDetails(catNum) {
            let category = this.props.categories[catNum];
            return <ReportDetails
                    category={category} i18n={i18n}
                    showList={() => this.setState({details: -1}) } />;
        },

        openModule(mod) {
            this.setState({
                details: this.props.categories.indexOf(mod)
            });
        }
	});
	return Reporter;

});
