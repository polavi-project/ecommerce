import A from "../../../../../../../js/production/a.js";

function Empty({ homeUrl }) {
    return React.createElement(
        "div",
        { className: "empty-shopping-cart uk-width-1-1" },
        React.createElement(
            "div",
            { className: "uk-align-center uk-text-center" },
            React.createElement(
                "div",
                null,
                React.createElement(
                    "h3",
                    null,
                    "Your cart is empty!"
                )
            ),
            React.createElement(A, { text: "Home page", url: homeUrl, classes: "uk-button uk-button-default uk-button-small" })
        )
    );
}

function Items({ items }) {
    if (items.length === 0) return React.createElement(Empty, { homeUrl: window.base_url });else return React.createElement(
        "div",
        { id: "shopping-cart-items", className: "uk-width-3-4" },
        React.createElement(
            "table",
            { className: "uk-table uk-table-divider" },
            React.createElement(
                "thead",
                null,
                React.createElement(
                    "tr",
                    null,
                    React.createElement(
                        "td",
                        null,
                        React.createElement(
                            "span",
                            null,
                            "Product"
                        )
                    ),
                    React.createElement(
                        "td",
                        null,
                        React.createElement(
                            "span",
                            null,
                            "Price"
                        )
                    ),
                    React.createElement(
                        "td",
                        null,
                        React.createElement(
                            "span",
                            null,
                            "Quantity"
                        )
                    ),
                    React.createElement(
                        "td",
                        null,
                        React.createElement(
                            "span",
                            null,
                            "Total"
                        )
                    ),
                    React.createElement(
                        "td",
                        null,
                        React.createElement(
                            "span",
                            null,
                            " "
                        )
                    )
                )
            ),
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
                                "div",
                                { className: "cart-item-thumb shopping-cart-item-thumb" },
                                item.thumbnail && React.createElement("img", { src: item.thumbnail, alt: item.product_name }),
                                !item.thumbnail && React.createElement("span", { "uk-icon": "icon: image; ratio: 5" })
                            ),
                            React.createElement(A, { url: item.productUrl, text: item.product_name, classes: "uk-link-muted" }),
                            item.error && React.createElement(
                                "p",
                                { style: { color: "red" } },
                                item.error
                            )
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                "span",
                                null,
                                item.final_price
                            )
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                "span",
                                null,
                                item.qty
                            )
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                "span",
                                null,
                                item.total
                            )
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                A,
                                { url: window.base_url + "/cart/remove/" + item.cart_item_id, text: "" },
                                React.createElement("span", { "uk-icon": "close" })
                            )
                        )
                    );
                })
            )
        )
    );
}

export default Items;