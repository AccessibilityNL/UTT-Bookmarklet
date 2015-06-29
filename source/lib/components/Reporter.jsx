define(['React', './UttModule'],
function (React, UttModule) {

    let i18n;

	let Reporter = React.createClass({
        render() {
        	i18n  = this.props.i18n;
        	return <UttModule className="reporter" i18n={i18n}>
        		foobar
        	</UttModule>;
		}
	});
	return Reporter;

});