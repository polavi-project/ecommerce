import Fetch from "../../../../../../../../js/production/fetch.js";

class Remove extends React.Component {
    constructor(props) {
        super(props);
    }

    onClick(e, item_id) {
        e.preventDefault();
        const { dispatch } = this.props;
        Fetch(dispatch, window.base_url + "checkout/cart/remove/" + item_id, false, "GET");
    }

    render() {
        const { item_id } = this.props;
        return React.createElement(
            "a",
            { className: "uk-button uk-button-primary uk-button-small", onClick: e => this.onClick(e, item_id) },
            React.createElement(
                "span",
                null,
                "Remove"
            )
        );
    }
}
export default ReactRedux.connect()(Remove);