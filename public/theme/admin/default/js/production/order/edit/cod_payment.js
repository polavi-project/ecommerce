import A from "../../../../../../../js/production/a.js";

export default function CodPayment({ grand_total, payment_status, order_id }) {
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
                    "Payment - Cash on delivery"
                )
            ),
            React.createElement(
                "div",
                null,
                React.createElement(
                    "span",
                    null,
                    React.createElement(
                        "strong",
                        null,
                        _grand_total
                    )
                ),
                React.createElement(
                    "span",
                    null,
                    payment_status === "pending" && React.createElement(
                        "span",
                        { className: "uk-label uk-label-warning" },
                        React.createElement("span", { "uk-icon": "tag" }),
                        " Pending"
                    ),
                    payment_status === "paid" && React.createElement(
                        "span",
                        { className: "uk-label uk-label-success" },
                        React.createElement("span", { "uk-icon": "tag" }),
                        " Paid"
                    )
                ),
                payment_status === "pending" && React.createElement(
                    "div",
                    null,
                    React.createElement(
                        A,
                        { url: window.base_url + `/order/capture/offline/${order_id}` },
                        React.createElement(
                            "span",
                            { className: "uk-button uk-button-small uk-button-primary" },
                            "Pay offline"
                        )
                    )
                )
            )
        )
    );
}