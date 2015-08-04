define(['React', 'UTT/main', './Header'],
function (React, UTT, Header) {

	let i18n;
	let UttModule = React.createClass({

		getInitialState() {
			setTimeout(() => this.setState({enter: true}), 10);
			return {enter: false};
		},

		render() {
			i18n = this.props.i18n;
			let animation =  " UTT-fade";
			if (this.state.enter) {
				animation += ' UTT-enter';
			}

			return <div className={this.props.className + " UTT-module"}>
				<div className={"UTT-content " + animation}>
					{this.props.children}
				</div>

				<div className="UTT-footer"><p>
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
			this.setState( {enter: false} );
			setTimeout(() => UTT.showHome(), 300);
		}
	});

	return UttModule;
});