import Head from "./head.js";
import Row from "./row.js";
import Fetch from "../../../../../../../js/production/fetch.js";

class ShoppingCart extends React.Component {
    constructor(props) {
        super(props);
    }

    emptyCart(e) {
        e.preventDefault();
        const { dispatch } = this.props;
        Fetch(dispatch, window.base_url + "cart/empty", false, "GET");
    }

    render() {
        const { items } = this.props;
        return React.createElement(
            "div",
            { id: this.props.id, className: this.props.id + "-content-inner item-list" },
            React.createElement(
                "table",
                { className: "uk-table uk-table-divider" },
                React.createElement(
                    "thead",
                    null,
                    React.createElement(Head, { id: "cart_item_head" })
                ),
                React.createElement(
                    "tbody",
                    null,
                    items.map((item, index) => {
                        return React.createElement(Row, { id: "cart_item_row_" + item.id, key: index });
                    })
                ),
                React.createElement(
                    "tfoot",
                    null,
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                "button",
                                { className: "uk-button-small uk-button uk-button-primary", onClick: e => this.emptyCart(e) },
                                "Empty cart"
                            )
                        )
                    )
                )
            )
        );
    }
}

export default ReactRedux.connect()(ShoppingCart);