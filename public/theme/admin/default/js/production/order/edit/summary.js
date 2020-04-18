import Area from "../../../../../../../js/production/area.js";

function OrderSummary() {
    const orderId = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.order_id'));
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.currency'));
    const coupon = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.coupon'));
    const discountAmount = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.discount_amount'));
    const taxAmount = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.tax_amount'));
    const subTotal = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.sub_total'));
    const grandTotal = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.grand_total'));

    const _taxAmount = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(taxAmount);
    const _discountAmount = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(discountAmount);
    const _subTotal = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(subTotal);
    const _grandTotal = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(grandTotal);
    return React.createElement(
        'div',
        { className: 'sml-block' },
        React.createElement(
            'div',
            { className: 'sml-block-title' },
            'Summary'
        ),
        React.createElement(
            'table',
            { className: 'table table-bordered' },
            React.createElement(
                'tbody',
                null,
                React.createElement(Area, {
                    id: "order_summary_block",
                    orderId: orderId,
                    currency: currency,
                    grandTotal: grandTotal,
                    coupon: coupon,
                    discountAmount: discountAmount,
                    taxAmount: taxAmount,
                    noOuter: true,
                    coreWidgets: [{
                        'component': "tr",
                        'props': { children: [React.createElement(
                                'td',
                                { key: 'key' },
                                React.createElement(
                                    'span',
                                    null,
                                    'Subtotal'
                                )
                            ), React.createElement(
                                'td',
                                { key: 'value' },
                                React.createElement(
                                    'span',
                                    null,
                                    _subTotal
                                )
                            )] },
                        'sort_order': 5,
                        'id': 'summary_subtotal'
                    }, {
                        'component': "tr",
                        'props': { children: [React.createElement(
                                'td',
                                { key: 'key' },
                                React.createElement(
                                    'span',
                                    null,
                                    'Tax'
                                )
                            ), React.createElement(
                                'td',
                                { key: 'value' },
                                React.createElement(
                                    'span',
                                    null,
                                    _taxAmount
                                )
                            )] },
                        'sort_order': 10,
                        'id': 'summary_tax'
                    }, {
                        'component': "tr",
                        'props': { children: [React.createElement(
                                'td',
                                { key: 'key' },
                                React.createElement(
                                    'span',
                                    null,
                                    'Discount (',
                                    coupon,
                                    ')'
                                )
                            ), React.createElement(
                                'td',
                                { key: 'value' },
                                React.createElement(
                                    'span',
                                    null,
                                    _discountAmount
                                )
                            )] },
                        'sort_order': 20,
                        'id': 'summary_discount'
                    }, {
                        'component': "tr",
                        'props': { children: [React.createElement(
                                'td',
                                { key: 'key' },
                                React.createElement(
                                    'span',
                                    null,
                                    'Grand total'
                                )
                            ), React.createElement(
                                'td',
                                { key: 'value' },
                                React.createElement(
                                    'span',
                                    null,
                                    _grandTotal
                                )
                            )] },
                        'sort_order': 20,
                        'id': 'summary_grand_total'
                    }]
                })
            )
        )
    );
}

export { OrderSummary };