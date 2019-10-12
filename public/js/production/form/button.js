import { Fetch } from "../fetch.js";

class Button extends React.Component {
    constructor(props) {
        super(props);
    }

    onClick(e) {
        e.preventDefault();
        const { dispatch } = this.props;
        Fetch(dispatch, this.props.url);
    }
    render() {
        const { url, text, classes } = this.props;
        return React.createElement(
            "div",
            { className: "grid-button-container" },
            React.createElement(
                "a",
                { className: classes, href: url, onClick: this.onClick.bind(this) },
                React.createElement(
                    "span",
                    null,
                    text
                )
            )
        );
    }
}

export default ReactRedux.connect()(Button);