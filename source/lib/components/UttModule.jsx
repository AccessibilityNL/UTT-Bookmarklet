define(['React', 'UTT/main', './Header'],
function (React, UTT, Header) {

	let i18n;
	let UttModule = React.createClass({

		getInitialState() {
			return {enter: false};
		},

		render() {
			i18n = this.props.i18n;

			let animation =  " fade";
			if (this.state.enter) {
				animation += ' enter';
			}

			setTimeout(() => this.setState({enter: true}), 10);

			return <div className={this.props.className + " module"}>
				<Header i18n={i18n}></Header>

				<div className={"content" + animation}>
					{this.props.children}
				</div>

				<div className="footer"><p>
				  <a href="" onClick={this.home}>
				  	<img src={require.toUrl(
				  			'UTT/components/assets/images/home.svg'
				  		)} alt="" role="presentation"
				  		width="14" height="14" />
				  	{i18n`Back to overview`}
				  </a>
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