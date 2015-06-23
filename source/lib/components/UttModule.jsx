define(['React', 'UTT/main', './Header'],
function (React, UTT, Header) {

	let i18n;
	let UttModule = React.createClass({
		render() {
			i18n = this.props.i18n;
			return <div className={this.props.className + " module"}>
				<Header i18n={i18n}></Header>

				<div className="content">
					{this.props.children}
				</div>

				<div className="footer"><p>
				  <a href="" onClick={this.home}>Back to overview</a>
				</p></div>
			</div>;
		},
		home(e) {
			e.preventDefault();
			UTT.showHome();
		}
	});

	return UttModule;
});