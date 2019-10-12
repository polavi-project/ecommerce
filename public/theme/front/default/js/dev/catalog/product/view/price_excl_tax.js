const Price = ({price_excl_tax}) => {
    const _price_excl_tax = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(price_excl_tax);
    return <div className="price-container price-container-excl-tax">
        <div className="price-excl-tax">
            <span className="label">Excl. Tax: </span>
            <span className="price">{_price_excl_tax}</span>
        </div>
    </div>
};
export default Price;