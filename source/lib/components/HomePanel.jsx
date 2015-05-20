define(['React', './ModuleList'],
function (React, ModuleList) {
    let HomePanel = React.createClass({

        render() {
            return <div>
                <div class="header">
                    <h1>Title of the booklet</h1>
                    <p>product explination text</p>
                    <button>Info</button>
                </div>
                <ModuleList modules={this.props.modules} />
                <button>Results</button>
            </div>;
        }
    });
    return HomePanel;
});