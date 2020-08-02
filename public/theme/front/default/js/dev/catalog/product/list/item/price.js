const Price = ({price, salePrice}) => {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _price = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(price);
    const _salePrice = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(salePrice);
    return <div className="product-price-listing">
        {parseFloat(salePrice) === parseFloat(price) && <div>
            <span className="sale-price">{_price}</span>
        </div>}
        {parseFloat(salePrice) < parseFloat(price) && <div>
            <span className="sale-price">{_salePrice}</span> <span className="regular-price">{_price}</span>
        </div>}
    </div>
};
export {Price};