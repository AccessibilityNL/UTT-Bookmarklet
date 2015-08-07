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
            let content;
            if (this.state.details === -1) {
                content = this.renderList();
            } else {
                content = this.renderDetails(this.state.details);
            }

            return <UttModule className="utt-reporter" i18n={i18n}>
                {content}
            </UttModule>;
        },

        renderList() {
            let content = [<h1 className="utt-title">{i18n`Results list`}</h1>];
            let categories = this.props.categories;

            if (categories.length === 0) {
                content.push(<p>{i18n`No tests available`}</p>);
            } else {
                content.push(<ModuleList
                              openModule={this.openModule}
                              modules={categories} i18n={i18n} />);
            }

            return content;
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
