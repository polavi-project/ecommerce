var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Area from "../../../../../../../../js/production/area.js";

function Subtotal({ subTotal }) {
    return React.createElement(
        "tr",
        null,
        React.createElement(
            "td",
            null,
            "Subtotal"
        ),
        React.createElement(
            "td",
            null,
            React.createElement(
                "span",
                null,
                subTotal
            )
        )
    );
}

function Discount({ discountAmount }) {
    if (discountAmount === 0) return null;
    return React.createElement(
        "tr",
        null,
        React.createElement(
            "td",
            null,
            "Discount"
        ),
        React.createElement(
            "td",
            null,
            React.createElement(
                "span",
                null,
                discountAmount
            )
        )
    );
}

function ShippingFee({ shippingFee }) {
    return React.createElement(
        "tr",
        null,
        React.createElement(
            "td",
            null,
            "Shipping"
        ),
        React.createElement(
            "td",
            null,
            React.createElement(
                "span",
                null,
                shippingFee === 0 && "Free",
                shippingFee !== 0 && shippingFee
            )
        )
    );
}

function Tax({ taxAmount }) {
    return React.createElement(
        "tr",
        null,
        React.createElement(
            "td",
            null,
            "Tax"
        ),
        React.createElement(
            "td",
            null,
            React.createElement(
                "span",
                null,
                taxAmount
            )
        )
    );
}

function GrandTotal({ grandTotal }) {
    return React.createElement(
        "tr",
        null,
        React.createElement(
            "td",
            null,
            "Grand total"
        ),
        React.createElement(
            "td",
            null,
            React.createElement(
                "span",
                null,
                grandTotal
            )
        )
    );
}

function CartSummary() {
    const cart = ReactRedux.useSelector(state => _.get(state, 'appState.cart', {}));
    return React.createElement(
        "div",
        { className: "checkout-summary-cart" },
        React.createElement(
            "table",
            { className: "uk-table uk-table-small " },
            React.createElement(Area, {
                id: "checkout_summary_cart",
                reactcomponent: "tbody",
                coreWidgets: [{
                    'component': Subtotal,
                    'props': _extends({}, cart),
                    'sort_order': 10,
                    'id': 'checkout_order_summary_cart_subtotal'
                }, {
                    'component': Discount,
                    'props': _extends({}, cart),
                    'sort_order': 20,
                    'id': 'checkout_order_summary_cart_discount'
                }, {
                    'component': ShippingFee,
                    'props': _extends({}, cart),
                    'sort_order': 30,
                    'id': 'checkout_order_summary_cart_shipping'
                }, {
                    'component': Tax,
                    'props': _extends({}, cart),
                    'sort_order': 40,
                    'id': 'checkout_order_summary_cart_tax'
                }, {
                    'component': GrandTotal,
                    'props': _extends({}, cart),
                    'sort_order': 50,
                    'id': 'checkout_order_summary_cart_grand_total'
                }]
            })
        )
    );
}

export { CartSummary };