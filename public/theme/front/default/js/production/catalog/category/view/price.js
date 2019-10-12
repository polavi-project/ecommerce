const Price = ({ price, classes }) => {
    const _price = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(price);
    return React.createElement(
        'div',
        { className: classes },
        React.createElement(
            'span',
            null,
            _price
        )
    );
};
export default Price;