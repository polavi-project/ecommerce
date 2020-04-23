var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
            { className: "table table-bordered" },
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

function Transaction({ transactions, currency }) {
    return React.createElement(
        "div",
        { className: "payment-transactions" },
        React.createElement(
            "div",
            null,
            React.createElement("i", { className: "fas fa-credit-card" }),
            " Payment transactions"
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

export default function Payment(props) {
    const grandTotal = new Intl.NumberFormat('en', { style: 'currency', currency: props.currency }).format(props.grandTotal);
    return React.createElement(
        "div",
        { className: "sml-block mt-4" },
        React.createElement(
            "div",
            { className: "sml-block-title" },
            "Payment"
        ),
        React.createElement(
            "div",
            { className: "overflow-auto" },
            React.createElement(Area, {
                id: "order_payment_block",
                orderId: props.orderId,
                method: props.method,
                methodName: props.methodName,
                grandTotal: grandTotal,
                status: props.status,
                coreWidgets: [{
                    'component': Info,
                    'props': _extends({}, props),
                    'sort_order': 10,
                    'id': 'order_payment_fo'
                }, {
                    'component': Transaction,
                    'props': { transactions: props.payment_transactions, currency: props.currency },
                    'sort_order': 20,
                    'id': 'order_payment_transaction'
                }]
            })
        )
    );
}