define(['React', './UttModule'],
function (React, UttModule) {

    let i18n;

    let Assessor = React.createClass({
        render() {
            i18n  = this.props.i18n;
            let q = this.props.question;
            return <UttModule className="assessor" i18n={i18n}>
                {q  ? this.renderQuestion(q)
                    : this.renderNoQuestion()}
            </UttModule>;
        },

        renderQuestion(q) {
            let showHelp = (this.state.showHelp ? 'show': 'hide');
            return <div className="content">
                {this.renderModuleHead()}
                <div>
                    <h3>{i18n`question ${this.props.current}`}</h3>
                    <p>{q.questiontext}</p>

                    <p><a href="" onClick={this.toggleHelp}>
                        {i18n`more information`}
                    </a></p>
                    <p className={showHelp}>{q.helptext}</p>
                    {q.answers.map((answer, i) =>
                        <button key={i} onClick={this.props.sendResult.bind(null, answer.value)}>
                            {i18n(answer.text)}
                        </button>
                    )}
                </div>
            </div>;
        },

        renderModuleHead() {
            let perc    = (this.props.current - 1) / this.props.total * 100;

            return <div className="module-head">
                <h2>{i18n`CATG_TITLE`}</h2>
                <img src={this.props.iconSrc} width="48" height="48"
                    alt="" role="presentation" />
                <p>{i18n`CATG_DESCR`}</p>
                <div className="progress-bar">
                    <span className="label">
                        {this.props.current + " / " + this.props.total}
                    </span>
                    <span className="bar" style={{
                        "width" : perc + "%"
                    }}></span>
                </div>
            </div>;
        },

        renderNoQuestion() {
            return <div>{i18n`no question`}</div>;
        },

        getInitialState() {
            return { showHelp: false };
        },

        toggleHelp(e) {
            e.preventDefault();
            this.setState({
                showHelp: !this.state.showHelp
            });
        }

	});
	return Assessor;

});