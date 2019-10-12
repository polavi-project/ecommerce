const Price = ({ price }) => {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));

    const _price = new Intl.NumberFormat(window.language, { style: 'currency', currency: currency }).format(price);
    return React.createElement(
        'div',
        null,
        React.createElement(
            'span',
            null,
            _price
        )
    );
};
export { Price };