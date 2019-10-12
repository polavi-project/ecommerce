const Price = ({ price_incl_tax }) => {
    const _price_incl_tax = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(price_incl_tax);
    return <div className="price-container price-container-excl-tax">
        <div className="price-excl-tax">
            <span className="label">Incl. Tax: </span>
            <span className="price">{_price_incl_tax}</span>
        </div>
    </div>
};
export default Price;