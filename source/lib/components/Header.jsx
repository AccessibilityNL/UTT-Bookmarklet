define(['React'], function (React) {
    let Header = React.createClass({

    	render() {
            return <div className="header">
                <h1>
                    <img src="" width="54" height="54" />
                    AccessVerify
                </h1>
                <button className="info-button" onClick={this.toggleInfo}>Tool info</button>
                <p className={this.state.showInfo ? 'show info': 'hide info'}>
                    Basic check for the accessibility of the web
                </p>
            </div>;
    	},
        getInitialState() {
            return { showInfo: false };
        },
        toggleInfo() {
            this.setState({
                showInfo: !this.state.showInfo
            });
        }

	});

    return Header;
});