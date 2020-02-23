import Area from "../../../../../../../js/production/area.js";
import { PaymentStatus } from "./payment-status.js";

function Status({ status }) {
    return React.createElement(
        "td",
        null,
        React.createElement(PaymentStatus, { status: status })
    );
}

function Info({ orderId, method, methodName, status, grandTotal }) {
    return React.createElement(
        "div",
        { className: "payment-info" },
        React.createElement(
            "table",
            { className: "uk-table uk-table-small" },
            React.createElement(
                "thead",
                null,
                React.createElement(
                    "tr",
                    null,
                    React.createElement(Area, {
                        id: "order_payment_block_info_header",
                        orderId: orderId,
                        method: method,
                        methodName: methodName,
                        grandTotal: grandTotal,
                        status: status,
                        noOuter: true,
                        coreWidgets: [{
                            'component': "th",
                            'props': { children: React.createElement(
                                    "span",
                                    null,
                                    "Status"
                                ) },
                            'sort_order': 10,
                            'id': 'payment_status_header'
                        }, {
                            'component': "th",
                            'props': { children: React.createElement(
                                    "span",
                                    null,
                                    "Method"
                                ) },
                            'sort_order': 20,
                            'id': 'payment_method_header'
                        }, {
                            'component': "th",
                            'props': { children: React.createElement(
                                    "span",
                                    null,
                                    "Actions"
                                ) },
                            'sort_order': 30,
                            'id': 'payment_action_header'
                        }]
                    })
                )
            ),
            React.createElement(
                "tbody",
                null,
                React.createElement(
                    "tr",
                    null,
                    React.createElement(Area, {
                        id: "order_payment_block_info",
                        orderId: orderId,
                        method: method,
                        methodName: methodName,
                        grandTotal: grandTotal,
                        status: status,
                        noOuter: true,
                        coreWidgets: [{
                            'component': Status,
                            'props': { status: status },
                            'sort_order': 10,
                            'id': 'order_payment_status'
                        }, {
                            'component': "td",
                            'props': { children: React.createElement(
                                    "span",
                                    null,
                                    methodName
                                ) },
                            'sort_order': 20,
                            'id': 'order_payment_method'
                        }]
                    })
                )
            )
        )
    );
}

export default function Transaction({ transactions }) {
    const status = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.payment_status'));
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.currency', 'USD'));
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
                    const amount = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(t.amount);
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

function Payment() {
    const orderId = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.order_id'));
    const method = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.payment_method'));
    const methodName = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.payment_method_name'));
    const status = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.payment_status'));
    const grandTotal = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.grand_total'));
    return React.createElement(
        "div",
        { className: "uk-width-1-1 uk-margin-top" },
        React.createElement(
            "div",
            { className: "border-block" },
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
                    orderId: orderId,
                    method: method,
                    methodName: methodName,
                    grandTotal: grandTotal,
                    status: status,
                    coreWidgets: [{
                        'component': Info,
                        'props': { orderId, method, methodName, status, grandTotal },
                        'sort_order': 10,
                        'id': 'order_payment_fo'
                    }]
                })
            )
        )
    );
}

export { Payment };