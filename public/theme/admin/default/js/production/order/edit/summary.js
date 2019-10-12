export default function OrderSummary({ tax_amount, discount_amount, coupon, grand_total }) {
    const _tax_amount = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(tax_amount);
    const _discount_amount = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(discount_amount);
    const _grand_total = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(grand_total);
    return React.createElement(
        'div',
        { className: "uk-width-1-1" },
        React.createElement(
            'div',
            { className: 'uk-overflow-auto' },
            React.createElement(
                'div',
                null,
                React.createElement(
                    'strong',
                    null,
                    'Summary'
                )
            ),
            React.createElement(
                'table',
                { className: 'uk-table uk-table-small' },
                React.createElement(
                    'tbody',
                    null,
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            null,
                            React.createElement(
                                'span',
                                null,
                                'Tax:'
                            )
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(
                                'span',
                                null,
                                _tax_amount
                            )
                        )
                    ),
                    parseInt(discount_amount) > 0 && React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            null,
                            React.createElement(
                                'span',
                                null,
                                'Discount ',
                                React.createElement(
                                    'i',
                                    null,
                                    '(',
                                    coupon,
                                    ')'
                                ),
                                ':'
                            )
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(
                                'span',
                                null,
                                _discount_amount
                            )
                        )
                    ),
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            null,
                            React.createElement(
                                'span',
                                null,
                                'Grand total:'
                            )
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(
                                'span',
                                null,
                                _grand_total
                            )
                        )
                    )
                )
            )
        )
    );
}