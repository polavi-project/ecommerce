import A from "../../../../../../../js/production/a.js";

export default function Minicart({ cartUrl, checkoutUrl }) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const items = ReactRedux.useSelector(state => _.get(state, 'appState.cart.items', []));
    const subTotal = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(ReactRedux.useSelector(state => _.get(state, 'appState.cart.subTotal')));

    if (items.length === 0) return React.createElement(
        'div',
        { className: 'uk-inline' },
        React.createElement(
            'a',
            { href: '#', onClick: e => {
                    e.preventDefault();
                }, className: 'uk-link-muted' },
            React.createElement('span', { 'uk-icon': 'cart' }),
            React.createElement(
                'span',
                null,
                '(',
                items.length,
                ')'
            )
        ),
        React.createElement(
            'div',
            { className: 'mini-cart-content', 'uk-dropdown': 'mode: click; pos: bottom-left' },
            React.createElement(
                'div',
                null,
                React.createElement(
                    'span',
                    null,
                    'You have no item in cart'
                )
            )
        )
    );
    return React.createElement(
        'div',
        { className: 'uk-inline' },
        React.createElement(
            'a',
            { onClick: e => onClick(e) },
            React.createElement('span', { 'uk-icon': 'cart' }),
            React.createElement(
                'span',
                null,
                '(',
                items.length,
                ')'
            )
        ),
        React.createElement(
            'div',
            { className: 'mini-cart-content', 'uk-dropdown': 'mode: click; pos: bottom-justify' },
            React.createElement(
                'div',
                { className: '' },
                items.map((item, index) => {
                    const _price = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(item.final_price);
                    return React.createElement(
                        'div',
                        { key: index, className: 'uk-grid uk-grid-small' },
                        React.createElement(
                            'div',
                            { className: 'uk-width-3-4' },
                            React.createElement(
                                A,
                                { url: item.url },
                                React.createElement(
                                    'span',
                                    null,
                                    item.product_name
                                )
                            ),
                            React.createElement(
                                'div',
                                null,
                                item.qty,
                                ' x ',
                                _price
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'uk-width-1-4' },
                            'x'
                        )
                    );
                }),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'div',
                        { className: 'uk-align-right' },
                        React.createElement(
                            'span',
                            null,
                            'Total: '
                        ),
                        React.createElement(
                            'span',
                            null,
                            subTotal
                        )
                    )
                )
            ),
            React.createElement(
                A,
                { className: 'uk-button uk-button-small uk-button-primary', url: cartUrl },
                React.createElement(
                    'span',
                    null,
                    'Checkout'
                )
            ),
            React.createElement(
                A,
                { className: 'uk-button uk-button-small uk-button-primary uk-margin-small-left', url: checkoutUrl },
                React.createElement(
                    'span',
                    null,
                    'Shopping cart'
                )
            )
        )
    );
}