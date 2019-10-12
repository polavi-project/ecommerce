import {Fetch} from "../fetch.js"

class Button extends React.Component {
    constructor(props) {
        super(props);
    }

    onClick(e) {
        e.preventDefault();
        const {dispatch} = this.props;
        Fetch(dispatch, this.props.url);
    }
    render() {
        const { url, text, classes } = this.props;
        return (
                <div className="grid-button-container">
                    <a className={classes} href={url} onClick={this.onClick.bind(this)}><span>{text}</span></a>
                </div>
        );
    }
}

export default ReactRedux.connect()(Button)