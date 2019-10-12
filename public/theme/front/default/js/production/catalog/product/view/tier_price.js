const TierPrice = ({ prices, class_name }) => {
    return React.createElement(
        "div",
        { className: class_name + " price-container tier-price" },
        React.createElement(
            "ul",
            null,
            prices.map((price, index) => {
                const _price = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(price.price);
                if (price.qty > 1) {
                    return React.createElement(
                        "li",
                        { key: index },
                        "Buy ",
                        price.qty,
                        " for ",
                        React.createElement(
                            "span",
                            null,
                            _price
                        )
                    );
                }
            })
        )
    );
};
export default TierPrice;