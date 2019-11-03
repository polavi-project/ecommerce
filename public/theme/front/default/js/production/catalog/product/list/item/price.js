const Price = ({ price }) => {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _price = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(price);
    return React.createElement(
        'div',
        { className: 'product-price-listing' },
        React.createElement(
            'span',
            null,
            _price
        )
    );
};
export { Price };