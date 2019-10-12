const Price = ({ price }) => {
    const _price = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(price);
    return React.createElement(
        "div",
        { className: "price-container" },
        React.createElement(
            "span",
            null,
            _price
        )
    );
};
export default Price;