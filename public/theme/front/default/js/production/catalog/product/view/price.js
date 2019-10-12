const Price = ({ price }) => {
    const _price = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(price);
    return React.createElement(
        'div',
        null,
        React.createElement(
            'span',
            null,
            price
        )
    );
};
export default Price;