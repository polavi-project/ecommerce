const TierPrice = ({ prices = [] }) => {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.language', 'en'));

    if (prices.length === 0) return null;

    return React.createElement(
        'div',
        { className: "tier-price" },
        React.createElement(
            'ul',
            { className: 'uk-list' },
            prices.map((price, index) => {
                const _price = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(price.price);
                return React.createElement(
                    'li',
                    { key: index },
                    'Buy ',
                    price.qty,
                    ' for ',
                    React.createElement(
                        'span',
                        null,
                        _price
                    )
                );
            })
        )
    );
};

const Price = ({ tierPrices = [] }) => {
    const regularPrice = ReactRedux.useSelector(state => _.get(state, 'appState.product.regularPrice'));

    const [price] = React.useState(() => {
        if (tierPrices.length > 0 && tierPrices[0].qty === 1 && tierPrices[0].price < regularPrice) return tierPrices[0].price;
        return regularPrice;
    });

    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.language', 'en'));
    const _price = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(price);
    return React.createElement(
        'div',
        { className: 'product-view-price' },
        React.createElement(
            'span',
            { className: 'regular-price' },
            React.createElement(
                'strong',
                null,
                _price
            )
        ),
        React.createElement(TierPrice, { prices: tierPrices.filter(p => p.qty > 1) })
    );
};

export default Price;