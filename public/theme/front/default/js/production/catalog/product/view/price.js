const TierPrice = ({ prices = [] }) => {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));

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

    const [salePrice] = React.useState(() => {
        if (tierPrices.length > 0 && tierPrices[0].qty === 1 && tierPrices[0].price < regularPrice) return tierPrices[0].price;
        return regularPrice;
    });

    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _regularPrice = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(regularPrice);
    const _salePrice = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(salePrice);
    return React.createElement(
        'div',
        { className: 'product-view-price' },
        parseFloat(salePrice) < parseFloat(regularPrice) && React.createElement(
            'div',
            null,
            React.createElement(
                'span',
                { className: 'regular-price' },
                _regularPrice
            ),
            ' ',
            React.createElement(
                'span',
                { className: 'sale-price' },
                _salePrice
            )
        ),
        parseFloat(salePrice) === parseFloat(regularPrice) && React.createElement(
            'div',
            null,
            React.createElement(
                'span',
                { className: 'sale-price' },
                _regularPrice
            )
        ),
        React.createElement(TierPrice, { prices: tierPrices.filter(p => p.qty > 1) })
    );
};

export default Price;