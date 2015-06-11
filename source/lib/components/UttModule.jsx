define(['React', 'UTT/main', './Header'],
function (React, UTT, Header) {

	let UttModule = React.createClass({
		render() {
			return <div className={this.props.className + " module"}>
				<Header></Header>

				<div class="content">
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