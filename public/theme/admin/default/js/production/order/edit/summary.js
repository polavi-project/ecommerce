import Area from "../../../../../../../js/production/area.js";

export default function OrderSummary(props) {
    const _taxAmount = new Intl.NumberFormat('en', { style: 'currency', currency: props.currency }).format(props.tax_amount);
    const _discountAmount = new Intl.NumberFormat('en', { style: 'currency', currency: props.currency }).format(props.discount_amount);
    const _subTotal = new Intl.NumberFormat('en', { style: 'currency', currency: props.currency }).format(props.sub_total);
    const _grandTotal = new Intl.NumberFormat('en', { style: 'currency', currency: props.currency }).format(props.grand_total);
    return React.createElement(
        'div',
        { className: 'sml-block mt-4' },
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
                    orderId: props.order_id,
                    currency: props.currency,
                    grandTotal: props.grand_total,
                    coupon: props.coupon,
                    discountAmount: props.discount_amount,
                    taxAmount: props.tax_amount,
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
                                    props.coupon,
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
                        'sort_order': 30,
                        'id': 'summary_grand_total'
                    }]
                })
            )
        )
    );
}