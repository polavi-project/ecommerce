import A from "../../../../../../../js/production/a.js";
import { ReducerRegistry } from "../../../../../../../js/production/reducer_registry.js";
import { REQUEST_END } from "../../../../../../../js/production/event-types.js";

function Minicart({ id, items, item_count, discount_amount, tax_amount, grand_total }) {
    const [status, setStatus] = React.useState(false);

    const onClick = e => {
        e.preventDefault();
        setStatus(!status);
    };

    return React.createElement(
        "div",
        { id: id, className: id + "-content-inner" },
        React.createElement(
            "a",
            { onClick: e => onClick(e) },
            React.createElement("span", { "uk-icon": "cart" }),
            React.createElement(
                "span",
                null,
                "(",
                item_count,
                ")"
            )
        ),
        React.createElement(
            "div",
            { className: "mini-cart-content", style: { display: status ? 'block' : 'none' } },
            React.createElement(
                "table",
                { className: "uk-table" },
                React.createElement(
                    "tbody",
                    null,
                    items.map((item, index) => {
                        return React.createElement(
                            "tr",
                            { key: index },
                            React.createElement(
                                "td",
                                null,
                                React.createElement(
                                    A,
                                    { url: item.url },
                                    React.createElement(
                                        "span",
                                        null,
                                        item.product_name
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    null,
                                    item.qty,
                                    " x ",
                                    item.final_price
                                )
                            )
                        );
                    })
                ),
                React.createElement(
                    "tfoot",
                    null,
                    tax_amount !== 0 && React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            null,
                            "Tax:"
                        ),
                        React.createElement(
                            "td",
                            null,
                            tax_amount
                        )
                    ),
                    discount_amount !== 0 && React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            null,
                            "Discount:"
                        ),
                        React.createElement(
                            "td",
                            null,
                            discount_amount
                        )
                    ),
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            null,
                            "Total:"
                        ),
                        React.createElement(
                            "td",
                            null,
                            grand_total
                        )
                    )
                )
            ),
            React.createElement(
                A,
                { classes: "uk-button uk-button-small uk-button-primary", url: window.base_url + "/checkout/index" },
                React.createElement(
                    "span",
                    null,
                    "Checkout"
                )
            ),
            React.createElement(
                A,
                { classes: "uk-button uk-button-small uk-button-primary", url: window.base_url + "/checkout/cart" },
                React.createElement(
                    "span",
                    null,
                    "Shopping cart"
                )
            )
        )
    );
}

function reducer(state = {}, action = {}) {
    if (action.type === REQUEST_END) {
        if (action.minicart !== undefined) return action.minicart;
    }
    return state;
}

ReducerRegistry.register('minicart', reducer);

const mapStateToProps = (state, ownProps) => {
    return state.minicart;
};

export default ReactRedux.connect(mapStateToProps)(Minicart);