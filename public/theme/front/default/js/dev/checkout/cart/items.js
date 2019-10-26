import A from "../../../../../../../js/production/a.js";

function Empty({homeUrl}) {
    return <div className="empty-shopping-cart uk-width-1-1">
        <div className="uk-align-center uk-text-center">
            <div><h3>Your cart is empty!</h3></div>
            <A text="Home page" url={homeUrl} classes="uk-button uk-button-default uk-button-small"/>
        </div>
    </div>
}

function Items({items}) {
    const baseUrl = ReactRedux.useSelector(state => _.get(state, 'appState.base_url'));
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));

    if(items.length === 0)
        return <Empty homeUrl={baseUrl}/>;
    else
        return <div id="shopping-cart-items" className="uk-width-3-4">
            <table className="uk-table uk-table-divider">
                <thead>
                    <tr>
                        <td><span>Product</span></td>
                        <td><span>Price</span></td>
                        <td><span>Quantity</span></td>
                        <td><span>Total</span></td>
                        <td><span> </span></td>
                    </tr>
                </thead>
                <tbody>
                {
                    items.map((item, index) => {
                        const _finalPrice = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(item.final_price);
                        const _total = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(item.total);
                        return <tr key={index}>
                            <td>
                                <div className="cart-item-thumb shopping-cart-item-thumb">
                                    {item.thumbnail && <img src={item.thumbnail} alt={item.product_name}/>}
                                    {!item.thumbnail && <span uk-icon="icon: image; ratio: 5"></span>}
                                </div>
                                <A url={item.productUrl} text={item.product_name} classes="uk-link-muted"/>
                                {
                                    item.error &&
                                    <p style={{color: "red"}}>{item.error}</p>
                                }
                            </td>
                            <td><span>{_finalPrice}</span></td>
                            <td><span>{item.qty}</span></td>
                            <td><span>{_total}</span></td>
                            <td><A url={item.removeUrl} text=""><span uk-icon="close"></span></A></td>
                        </tr>
                    })
                }
                </tbody>
            </table>
        </div>
}

export default Items;