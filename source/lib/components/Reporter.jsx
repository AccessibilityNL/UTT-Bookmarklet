define(['React', './UttModule',  './ModuleList'],
function (React, UttModule, ModuleList) {

    let i18n;

	let Reporter = React.createClass({
        render() {
            i18n  = this.props.i18n;
            let modules = this.props.results;

        	return <UttModule className="reporter" i18n={i18n}>
        		<h1>{i18n`Results list`}</h1>
                <ModuleList modules={modules} i18n={i18n} />
        	</UttModule>;
		}
	});
	return Reporter;

});
