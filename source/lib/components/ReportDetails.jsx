define(['React'],
function (React) {

    let i18n;

	let ReportDetails = React.createClass({
		propTypes: {
			i18n: React.PropTypes.object.isRequired,
			details: React.PropTypes.object.isRequired
		},

		render() {
            i18n  = this.props.i18n;

            return <div>
            	Details!
            </div>;
        }
	});

	return ReportDetails;

});
