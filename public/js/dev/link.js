import {Fetch} from "./fetch.js"

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
        return (
                <li className="nav-item">
                    <a href={url} onClick={this.onClick.bind(this)}>{text}</a>
                    {this.props.children}
                </li>
        );
    }
}

export default Link