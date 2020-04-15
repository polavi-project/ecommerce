import A from "../../../../../../../js/production/a.js";

export default function BestCustomers({ customers, listUrl }) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency'));

    return React.createElement(
        "div",
        { className: "sml-block mt-4" },
        React.createElement(
            "div",
            { className: "sml-block-title sml-flex-space-between" },
            React.createElement(
                "div",
                null,
                "Best customers"
            ),
            React.createElement(
                "div",
                null,
                React.createElement(
                    A,
                    { className: "normal-font", url: listUrl },
                    "All customers"
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
                        "Full name"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Orders"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Total"
                    )
                )
            ),
            React.createElement(
                "tbody",
                null,
                customers.map((c, i) => {
                    const _total = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(c.total);
                    return React.createElement(
                        "tr",
                        { key: i },
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                A,
                                { url: c.editUrl },
                                c.full_name
                            )
                        ),
                        React.createElement(
                            "td",
                            null,
                            c.orders
                        ),
                        React.createElement(
                            "td",
                            null,
                            _total
                        )
                    );
                })
            )
        )
    );
}