define(['React', './UttModule',  './ModuleList', './ReportDetails'],
function (React, UttModule, ModuleList, ReportDetails) {

    let i18n;

	let Reporter = React.createClass({
        getInitialState() {
            return { details: false };
        },

        render() {
            i18n  = this.props.i18n;
            return <UttModule className="reporter" i18n={i18n}>
                <h1>{i18n`Results list`}</h1>
                {(!this.state.details ? this.renderList()
                                      : this.renderDetails(this.state.details) )}
            </UttModule>;
        },

        renderList() {
            let modules = this.props.categories;
            return <ModuleList
                    openModule={this.openModule}
                    modules={modules} i18n={i18n} />;
        },

        renderDetails(details) {
            return <ReportDetails
                details={details} i18n={i18n}
                showList={() => this.setState({details: false}) } />;
        },

        openModule(mod) {
            this.setState({details: mod});
        }
	});
	return Reporter;

});
