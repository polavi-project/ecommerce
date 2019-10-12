const Price = ({price}) => {
    const _price = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(price);
    return <div>
        <span>{price}</span>
    </div>
};
export default Price;