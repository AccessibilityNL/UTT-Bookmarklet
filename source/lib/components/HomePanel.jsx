define(['React', './ModuleList'],
function (React, ModuleList) {
    let HomePanel = React.createClass({
        getInitialState() {
            return { showInfo: false };
        },
        toggleInfo() {
            console.log(this.state.showInfo);
            this.setState({
                showInfo: !this.state.showInfo
            });
        },
        render() {
            return <div>
                <div className="header">
                    <h1>Title of the booklet</h1>
                    <p>product explination text</p>
                    <button onClick={this.toggleInfo}>Info</button>
                    <p className={this.state.showInfo ? 'show info': 'hide info'}>
                        Info!
                    </p>
                </div>
                <ModuleList modules={this.props.modules} />
                <button>Results</button>
            </div>;
        }
    });
    return HomePanel;
});