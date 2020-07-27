import A from "../../../../../../../js/production/a.js";

export default function Minicart({ cartUrl, checkoutUrl }) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const items = ReactRedux.useSelector(state => _.get(state, 'appState.cart.items', []));
    const subTotal = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(ReactRedux.useSelector(state => _.get(state, 'appState.cart.subTotal')));
    const [show, setShow] = React.useState(false);

    const onOpen = e => {
        e.preventDefault();
        setShow(true);
    };

    const onClose = e => {
        e.preventDefault();
        setShow(false);
    };

    if (items.length === 0) return React.createElement(
        'div',
        { className: 'mini-cart-wrapper' },
        React.createElement(
            'a',
            { href: '#', onClick: e => onOpen(e) },
            React.createElement(
                'span',
                null,
                'Cart'
            ),
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
            { className: 'mini-cart-content', style: { display: show === false ? "none" : "block" } },
            React.createElement(
                'div',
                { className: 'd-flex justify-content-end' },
                React.createElement(
                    'a',
                    { href: '#', onClick: e => onClose(e) },
                    'X'
                )
            ),
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
        { className: 'mini-cart-wrapper' },
        React.createElement(
            'a',
            { href: '#', onClick: e => onOpen(e), className: '' },
            React.createElement(
                'span',
                null,
                'Cart'
            ),
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
            { className: 'mini-cart-content', style: { display: show === false ? "none" : "block" } },
            React.createElement(
                'div',
                { className: 'd-flex justify-content-end' },
                React.createElement(
                    'a',
                    { href: '#', onClick: e => onClose(e) },
                    'X'
                )
            ),
            React.createElement(
                'div',
                { className: '' },
                items.map((item, index) => {
                    const _price = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(item.final_price);
                    return React.createElement(
                        'div',
                        { key: index, className: 'container' },
                        React.createElement(
                            'div',
                            { className: 'row' },
                            React.createElement(
                                'div',
                                { className: 'col-9' },
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
                                { className: 'col-3' },
                                'x'
                            )
                        )
                    );
                }),
                React.createElement(
                    'div',
                    { className: 'd-flex justify-content-end mt-4' },
                    React.createElement(
                        'div',
                        { className: '' },
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
                'div',
                { className: 'd-flex justify-content-end mt-4' },
                React.createElement(
                    A,
                    { className: 'btn btn-primary mr-2', url: cartUrl },
                    React.createElement(
                        'span',
                        null,
                        'Shopping cart'
                    )
                ),
                React.createElement(
                    A,
                    { className: 'btn btn-primary', url: checkoutUrl },
                    React.createElement(
                        'span',
                        null,
                        'Checkout'
                    )
                )
            )
        )
    );
}