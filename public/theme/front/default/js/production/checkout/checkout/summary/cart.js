var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Area from "../../../../../../../../js/production/area.js";

function Subtotal({ subTotal }) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _subTotal = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(subTotal);

    return React.createElement(
        'tr',
        null,
        React.createElement(
            'td',
            null,
            'Subtotal'
        ),
        React.createElement(
            'td',
            null,
            React.createElement(
                'span',
                null,
                _subTotal
            )
        )
    );
}

function Discount({ discountAmount }) {
    if (discountAmount === 0) return null;

    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _discountAmount = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(discountAmount);

    return React.createElement(
        'tr',
        null,
        React.createElement(
            'td',
            null,
            'Discount'
        ),
        React.createElement(
            'td',
            null,
            React.createElement(
                'span',
                null,
                _discountAmount
            )
        )
    );
}

function ShippingFee({ shippingFee }) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _shippingFee = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(shippingFee);

    return React.createElement(
        'tr',
        null,
        React.createElement(
            'td',
            null,
            'Shipping'
        ),
        React.createElement(
            'td',
            null,
            React.createElement(
                'span',
                null,
                shippingFee === 0 && "Free",
                shippingFee !== 0 && _shippingFee
            )
        )
    );
}

function Tax({ taxAmount }) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _taxAmount = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(taxAmount);

    return React.createElement(
        'tr',
        null,
        React.createElement(
            'td',
            null,
            'Tax'
        ),
        React.createElement(
            'td',
            null,
            React.createElement(
                'span',
                null,
                _taxAmount
            )
        )
    );
}

function GrandTotal({ grandTotal }) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _grandTotal = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(grandTotal);

    return React.createElement(
        'tr',
        null,
        React.createElement(
            'td',
            null,
            'Grand total'
        ),
        React.createElement(
            'td',
            null,
            React.createElement(
                'span',
                null,
                _grandTotal
            )
        )
    );
}

function CartSummary() {
    const cart = ReactRedux.useSelector(state => _.get(state, 'appState.cart', {}));
    return React.createElement(
        'div',
        { className: 'checkout-summary-cart' },
        React.createElement(
            'table',
            { className: 'checkout-cart-summary-table' },
            React.createElement(
                'tbody',
                null,
                React.createElement(Area, {
                    id: "checkout_summary_cart",
                    noOuter: true,
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
        )
    );
}

export { CartSummary };