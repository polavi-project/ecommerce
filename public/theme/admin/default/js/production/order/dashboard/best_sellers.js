import A from "../../../../../../../js/production/a.js";

export default function BestSellers({ products, listUrl }) {
    return React.createElement(
        "div",
        { className: "sml-block mt-4" },
        React.createElement(
            "div",
            { className: "sml-block-title sml-flex-space-between" },
            React.createElement(
                "div",
                null,
                "Best sellers"
            ),
            React.createElement(
                "div",
                null,
                React.createElement(
                    A,
                    { className: "normal-font", url: listUrl },
                    "All products"
                )
            )
        ),
        React.createElement(
            "table",
            { className: "table table-bordered" },
            React.createElement(
                "thead",
                null,
                React.createElement(
                    "tr",
                    null,
                    React.createElement(
                        "th",
                        null,
                        "Product name"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Sku"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Price"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Sold Quantity"
                    )
                )
            ),
            React.createElement(
                "tbody",
                null,
                products.map((p, i) => {
                    return React.createElement(
                        "tr",
                        { key: i },
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                A,
                                { url: p.editUrl },
                                p.name
                            )
                        ),
                        React.createElement(
                            "td",
                            null,
                            p.sku
                        ),
                        React.createElement(
                            "td",
                            null,
                            p.price
                        ),
                        React.createElement(
                            "td",
                            null,
                            p.qty
                        )
                    );
                })
            )
        )
    );
}