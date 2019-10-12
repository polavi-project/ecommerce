import { Fetch } from "./fetch.js";

class Link extends React.Component {
    constructor(props) {
        super(props);
    }

    onClick(e) {
        e.preventDefault();
        Fetch(this.props.url);
    }
    render() {
        const { url, text } = this.props;
        return React.createElement(
            "li",
            { className: "nav-item" },
            React.createElement(
                "a",
                { href: url, onClick: this.onClick.bind(this) },
                text
            ),
            this.props.children
        );
    }
}

export default Link;