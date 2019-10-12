import Area from "../../../../../../../js/production/area.js";
import { PaymentStatus } from "./payment-status.js";

function Status({ status }) {
    return React.createElement(
        "td",
        null,
        React.createElement(PaymentStatus, { status: status })
    );
}

function Info({ order_id, payment_method, payment_status, grand_total }) {
    return React.createElement(
        "div",
        { className: "payment-info" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "strong",
                null,
                "Information"
            )
        ),
        React.createElement(
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
                        "Status"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Method"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Actions"
                    )
                )
            ),
            React.createElement(
                "tbody",
                null,
                React.createElement(Area, {
                    id: "order_payment_block_info",
                    order_id: order_id,
                    payment_method: payment_method,
                    grand_total: grand_total,
                    payment_status: payment_status,
                    reactcomponent: "tr",
                    coreWidgets: [{
                        'component': Status,
                        'props': { status: payment_status },
                        'sort_order': 10,
                        'id': 'order_payment_status'
                    }]
                })
            )
        )
    );
}

function Transaction({ transactions }) {
    return React.createElement(
        "div",
        { className: "payment-transactions" },
        React.createElement(
            "div",
            null,
            React.createElement("span", { "uk-icon": "credit-card" }),
            " ",
            React.createElement(
                "strong",
                null,
                "Payment transactions"
            )
        ),
        React.createElement(
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
                            "Date"
                        )
                    ),
                    React.createElement(
                        "th",
                        null,
                        React.createElement(
                            "span",
                            null,
                            "Type"
                        )
                    ),
                    React.createElement(
                        "th",
                        null,
                        React.createElement(
                            "span",
                            null,
                            "Code"
                        )
                    ),
                    React.createElement(
                        "th",
                        null,
                        React.createElement(
                            "span",
                            null,
                            "Amount"
                        )
                    ),
                    React.createElement(
                        "th",
                        null,
                        React.createElement(
                            "span",
                            null,
                            "Action"
                        )
                    )
                )
            ),
            React.createElement(
                "tbody",
                null,
                transactions.map((t, i) => {
                    let date = new Date(t.created_at);
                    const amount = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(t.amount);
                    return React.createElement(
                        "tr",
                        { key: i },
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                "span",
                                null,
                                date.toDateString()
                            )
                        ),
                        React.createElement(
                            "td",
                            null,
                            t.transaction_type === 'online' && React.createElement("span", { "uk-tooltip": t.transaction_type, "uk-icon": "credit-card" }),
                            t.transaction_type === 'offline' && React.createElement("span", { "uk-tooltip": t.transaction_type, "uk-icon": "file-text" })
                        ),
                        React.createElement(
                            "td",
                            null,
                            t.parent_transaction_id && React.createElement(
                                "span",
                                null,
                                t.parent_transaction_id
                            ),
                            !t.parent_transaction_id && React.createElement(
                                "span",
                                null,
                                "---"
                            )
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                "span",
                                null,
                                amount
                            )
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                "span",
                                null,
                                t.payment_action
                            )
                        )
                    );
                }),
                transactions.length === 0 && React.createElement(
                    "tr",
                    null,
                    React.createElement(
                        "td",
                        { colSpan: "100" },
                        React.createElement(
                            "div",
                            null,
                            "There is no transaction to display"
                        )
                    )
                )
            )
        )
    );
}

export default function Payment({ order_id, payment_method, grand_total, payment_status, transactions }) {
    return React.createElement(
        "div",
        { className: "uk-width-1-1" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "h3",
                null,
                "Payment"
            )
        ),
        React.createElement(
            "div",
            { className: "uk-overflow-auto" },
            React.createElement(Area, {
                id: "order_payment_block",
                order_id: order_id,
                payment_method: payment_method,
                grand_total: grand_total,
                payment_status: payment_status,
                transactions: transactions,
                coreWidgets: [{
                    'component': Info,
                    'props': { order_id, payment_method, payment_status, grand_total },
                    'sort_order': 10,
                    'id': 'order_payment_fo'
                }, {
                    'component': Transaction,
                    'props': { transactions },
                    'sort_order': 20,
                    'id': 'order_payment_transaction'
                }]
            })
        )
    );
}