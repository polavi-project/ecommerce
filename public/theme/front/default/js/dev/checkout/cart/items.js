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
    if(items.length === 0)
        return <Empty homeUrl={window.base_url}/>;
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
                        return <tr key={index}>
                            <td>
                                <A url={item.productUrl} text={item.product_name}/>
                                {
                                    item.error &&
                                    <p style={{color: "red"}}>{item.error}</p>
                                }
                            </td>
                            <td><span>{item.final_price}</span></td>
                            <td><span>{item.qty}</span></td>
                            <td><span>{item.total}</span></td>
                            <td><A url={window.base_url  + "/cart/remove/" + item.cart_item_id} text=""><span uk-icon="close"></span></A></td>
                        </tr>
                    })
                }
                </tbody>
            </table>
        </div>
}

export default Items;