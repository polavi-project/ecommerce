const TierPrice = ({prices = []}) => {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));

    if(prices.length === 0)
        return null;

    return <div className={"tier-price"}>
        <ul className="uk-list">
            {prices.map((price, index)=>{
                const _price = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(price.price);
                return <li key={index}>Buy {price.qty} for <span>{_price}</span></li>
            })}
        </ul>
    </div>
};

const Price = ({tierPrices = []}) => {
    const regularPrice = ReactRedux.useSelector(state => _.get(state, 'appState.product.regularPrice'));

    const [salePrice] = React.useState(()=>{
        if(tierPrices.length > 0 && tierPrices[0].qty === 1 && tierPrices[0].price < regularPrice)
            return tierPrices[0].price;
        return regularPrice;
    });

    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _regularPrice = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(regularPrice);
    const _salePrice = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(salePrice);
    return <div className="product-view-price uk-margin-small-top">
        {parseFloat(salePrice) < parseFloat(regularPrice) && <div>
            <span className="regular-price">{_regularPrice}</span> <span className="sale-price">{_salePrice}</span>
        </div>}
        {parseFloat(salePrice) === parseFloat(regularPrice) && <div>
            <span className="sale-price">{_regularPrice}</span>
        </div>}
        <TierPrice prices={ tierPrices.filter((p) => p.qty > 1)}/>
    </div>
};

export default Price;