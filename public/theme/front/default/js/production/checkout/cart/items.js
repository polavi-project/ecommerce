import A from "../../../../../../../js/production/a.js";

function Empty({ homeUrl }) {
    return React.createElement(
        "div",
        { className: "empty-shopping-cart w-100" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                { className: "mb-4" },
                React.createElement(
                    "h4",
                    null,
                    "Your cart is empty!"
                )
            ),
            React.createElement(A, { text: "Home page", url: homeUrl, className: "btn btn-primary" })
        )
    );
}

function ItemOptions({ options = [] }) {
    if (options.length === 0) return null;
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));

    return React.createElement(
        "div",
        { className: "cart-item-options" },
        React.createElement(
            "ul",
            { className: "list-basic" },
            options.map((o, i) => {
                return React.createElement(
                    "li",
                    { key: i },
                    React.createElement(
                        "span",
                        { className: "option-name" },
                        React.createElement(
                            "strong",
                            null,
                            o.option_name,
                            " : "
                        )
                    ),
                    o.values.map((v, k) => {
                        const _extraPrice = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(v.extra_price);
                        return React.createElement(
                            "span",
                            { key: k },
                            React.createElement(
                                "i",
                                { className: "value-text" },
                                v.value_text
                            ),
                            React.createElement(
                                "span",
                                { className: "extra-price" },
                                "(",
                                _extraPrice,
                                ")"
                            ),
                            " "
                        );
                    })
                );
            })
        )
    );
}

function ItemVariantOptions({ options = [] }) {
    if (!options || options.length === 0) return null;

    return React.createElement(
        "div",
        { className: "cart-item-variant-options" },
        React.createElement(
            "ul",
            { className: "list-basic" },
            options.map((o, i) => {
                return React.createElement(
                    "li",
                    { key: i },
                    React.createElement(
                        "span",
                        { className: "attribute-name" },
                        React.createElement(
                            "strong",
                            null,
                            o.attribute_name,
                            " : "
                        )
                    ),
                    React.createElement(
                        "span",
                        null,
                        React.createElement(
                            "i",
                            { className: "value-text" },
                            o.option_name
                        )
                    )
                );
            })
        )
    );
}

function Items({ items }) {
    const baseUrl = ReactRedux.useSelector(state => _.get(state, 'appState.baseUrl'));
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));

    if (items.length === 0) return React.createElement(Empty, { homeUrl: baseUrl });else return React.createElement(
        "div",
        { id: "shopping-cart-items", className: "col-12 col-md-8" },
        React.createElement(
            "table",
            { className: "table" },
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
                    const _regularPrice = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(item.product_price);
                    const _finalPrice = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(item.final_price);
                    const _total = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(item.total);
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
                            React.createElement(
                                "div",
                                { className: "cart-tem-info" },
                                React.createElement(A, { url: item.productUrl, text: item.product_name, classes: "" }),
                                item.error.map((e, i) => React.createElement(
                                    "div",
                                    { className: "text-danger", key: i },
                                    e.message
                                )),
                                React.createElement(ItemOptions, { options: item.options }),
                                React.createElement(ItemVariantOptions, { options: item.variant_options })
                            )
                        ),
                        React.createElement(
                            "td",
                            null,
                            parseFloat(item.final_price) < parseFloat(item.product_price) && React.createElement(
                                "div",
                                null,
                                React.createElement(
                                    "span",
                                    { className: "regular-price" },
                                    _regularPrice
                                ),
                                " ",
                                React.createElement(
                                    "span",
                                    { className: "sale-price" },
                                    _finalPrice
                                )
                            ),
                            parseFloat(item.final_price) >= parseFloat(item.product_price) && React.createElement(
                                "div",
                                null,
                                React.createElement(
                                    "span",
                                    { className: "sale-price" },
                                    _finalPrice
                                )
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
                                _total
                            )
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                A,
                                { url: item.removeUrl, text: "" },
                                React.createElement(
                                    "span",
                                    null,
                                    "x"
                                )
                            )
                        )
                    );
                })
            )
        )
    );
}

export default Items;