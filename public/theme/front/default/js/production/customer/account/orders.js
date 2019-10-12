import A from "../../../../../../../js/production/a.js";

function OrderInfo(props) {
    let date = new Date(props.created_at);
    return React.createElement(
        "div",
        { className: "uk-width-1-1" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "strong",
                null,
                "#",
                props.order_number
            ),
            " ",
            React.createElement(
                "i",
                null,
                date.toDateString()
            )
        ),
        React.createElement(
            "div",
            null,
            React.createElement(
                "span",
                null,
                props.status === "pending" && React.createElement(
                    "span",
                    { className: "uk-label uk-label-warning" },
                    React.createElement("span", { "uk-icon": "icon: tag; ratio: 0.8" }),
                    " Pending"
                ),
                props.status === "processing" && React.createElement(
                    "span",
                    { className: "uk-label" },
                    React.createElement("span", { "uk-icon": "icon: tag; ratio: 0.8" }),
                    " Processing"
                ),
                props.status === "completed" && React.createElement(
                    "span",
                    { className: "uk-label uk-label-success" },
                    React.createElement("span", { "uk-icon": "icon: tag; ratio: 0.8" }),
                    " Completed"
                ),
                props.status === "cancelled" && React.createElement(
                    "span",
                    { className: "uk-label uk-label-danger" },
                    React.createElement("span", { "uk-icon": "icon: tag; ratio: 0.8" }),
                    " Cancelled"
                )
            )
        )
    );
}

function Summary({ tax_amount, discount_amount, coupon, grand_total }) {
    const _tax_amount = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(tax_amount);
    const _discount_amount = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(discount_amount);
    const _grand_total = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(grand_total);
    return React.createElement(
        "div",
        { className: "uk-width-1-3" },
        React.createElement(
            "div",
            { className: "uk-overflow-auto" },
            React.createElement(
                "div",
                null,
                React.createElement(
                    "strong",
                    null,
                    "Summary"
                )
            ),
            React.createElement(
                "table",
                { className: "uk-table uk-table-small" },
                React.createElement(
                    "tbody",
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
                                "Tax:"
                            )
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                "span",
                                null,
                                _tax_amount
                            )
                        )
                    ),
                    parseInt(discount_amount) > 0 && React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                "span",
                                null,
                                "Discount ",
                                React.createElement(
                                    "i",
                                    null,
                                    "(",
                                    coupon,
                                    ")"
                                ),
                                ":"
                            )
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                "span",
                                null,
                                _discount_amount
                            )
                        )
                    ),
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                "span",
                                null,
                                "Grand total:"
                            )
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                "span",
                                null,
                                _grand_total
                            )
                        )
                    )
                )
            )
        )
    );
}

function Items({ items }) {
    return React.createElement(
        "table",
        { className: "uk-table uk-table-small" },
        React.createElement(
            "thead",
            null,
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    React.createElement(
                        "span",
                        null,
                        "Product"
                    )
                ),
                React.createElement(
                    "th",
                    null,
                    React.createElement(
                        "span",
                        null,
                        "Quantity"
                    )
                ),
                React.createElement(
                    "th",
                    null,
                    React.createElement(
                        "span",
                        null,
                        "Total"
                    )
                )
            )
        ),
        React.createElement(
            "tbody",
            null,
            items.map((i, k) => {
                const _price = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(i.product_price);
                const _finalPrice = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(i.final_price);
                return React.createElement(
                    "tr",
                    { key: k },
                    React.createElement(
                        "td",
                        null,
                        React.createElement(
                            "div",
                            { className: "uk-child-width-expand@s uk-grid uk-grid-small" },
                            React.createElement("div", { className: "uk-width-auto@m" }),
                            React.createElement(
                                "div",
                                { className: "uk-width-expand@m" },
                                React.createElement(
                                    A,
                                    { url: i.product_url },
                                    React.createElement(
                                        "span",
                                        null,
                                        i.product_name
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    null,
                                    React.createElement(
                                        "span",
                                        null,
                                        _price
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    null,
                                    React.createElement(
                                        "span",
                                        null,
                                        _finalPrice
                                    )
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "td",
                        null,
                        React.createElement(
                            "span",
                            null,
                            i.qty
                        )
                    ),
                    React.createElement(
                        "td",
                        null,
                        React.createElement(
                            "span",
                            null,
                            i.total
                        )
                    )
                );
            })
        )
    );
}
function Order({ index, order }) {
    let date = new Date(order.created_at);
    return React.createElement(
        "li",
        { className: index === 0 ? "uk-open" : "" },
        React.createElement(
            "a",
            { className: "uk-accordion-title", href: "#" },
            "#",
            order.order_number,
            " ",
            React.createElement(
                "i",
                null,
                date.toDateString()
            )
        ),
        React.createElement(
            "div",
            { className: "uk-accordion-content" },
            React.createElement(OrderInfo, order),
            React.createElement(Items, { items: order.items }),
            React.createElement(Summary, order)
        )
    );
}

export default function Orders({ orders }) {
    return React.createElement(
        "div",
        { className: "uk-width-1-1@m" },
        React.createElement(
            "h2",
            null,
            "Orders"
        ),
        React.createElement(
            "ul",
            { "uk-accordion": "1" },
            orders.map((o, i) => {
                return React.createElement(Order, { index: i, key: i, order: o });
            })
        )
    );
}