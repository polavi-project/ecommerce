const TierPrice = ({prices, class_name}) => {
    return <div className={class_name + " price-container tier-price"}>
        <ul>
            {prices.map((price, index)=>{
                const _price = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(price.price);
                if (price.qty > 1) {
                    return <li key={index}>Buy {price.qty} for <span>{_price}</span></li>
                }
            })}
        </ul>
    </div>
};
export default TierPrice;