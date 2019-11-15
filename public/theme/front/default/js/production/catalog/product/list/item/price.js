const Price = ({ price, salePrice }) => {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _price = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(price);
    const _salePrice = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(salePrice);
    return React.createElement(
        'div',
        { className: 'product-price-listing' },
        parseFloat(salePrice) < parseFloat(price) && React.createElement(
            'div',
            null,
            React.createElement(
                'span',
                { className: 'regular-price' },
                _price
            ),
            ' ',
            React.createElement(
                'span',
                { className: 'sale-price' },
                _salePrice
            )
        ),
        parseFloat(salePrice) === parseFloat(price) && React.createElement(
            'div',
            null,
            React.createElement(
                'span',
                { className: 'sale-price' },
                _price
            )
        )
    );
};
export { Price };