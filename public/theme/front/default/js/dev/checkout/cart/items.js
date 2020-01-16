import A from "../../../../../../../js/production/a.js";

function Empty({homeUrl}) {
    return <div className="empty-shopping-cart uk-width-1-1">
        <div className="uk-align-center uk-text-center">
            <div><h3>Your cart is empty!</h3></div>
            <A text="Home page" url={homeUrl} classes="uk-button uk-button-default uk-button-small"/>
        </div>
    </div>
}

function ItemOptions({options = []}) {
    if(options.length === 0)
        return null;
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));

    return <div className="cart-item-options">
        <ul className="uk-list">
            {options.map((o, i) => {
                return <li key={i}>
                    <span className="option-name"><strong>{o.option_name} : </strong></span>
                    {o.values.map((v, k) => {
                        const _extraPrice = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(v.extra_price);
                        return <span key={k}><i className="value-text">{v.value_text}</i><span className="extra-price">({_extraPrice})</span> </span>
                    })}
                </li>
            })}
        </ul>
    </div>
}

function Items({items}) {
    const baseUrl = ReactRedux.useSelector(state => _.get(state, 'appState.baseUrl'));
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));

    if(items.length === 0)
        return <Empty homeUrl={baseUrl}/>;
    else
        return <div id="shopping-cart-items" className="uk-width-3-4@m">
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
                        const _regularPrice = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(item.product_price);
                        const _finalPrice = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(item.final_price);
                        const _total = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(item.total);
                        return <tr key={index}>
                            <td>
                                <div className="cart-item-thumb shopping-cart-item-thumb">
                                    {item.thumbnail && <img src={item.thumbnail} alt={item.product_name}/>}
                                    {!item.thumbnail && <span uk-icon="icon: image; ratio: 5"></span>}
                                </div>
                                <div className="cart-tem-info">
                                    <A url={item.productUrl} text={item.product_name} classes="uk-link-muted"/>
                                    {
                                        item.error &&
                                        <div className="text-danger">{item.error}</div>
                                    }
                                    <ItemOptions options={item.options}/>
                                </div>
                            </td>
                            <td>
                                {parseFloat(item.final_price) < parseFloat(item.product_price) && <div>
                                    <span className="regular-price">{_regularPrice}</span> <span className="sale-price">{_finalPrice}</span>
                                </div>}
                                {parseFloat(item.final_price) === parseFloat(item.product_price) && <div>
                                    <span className="sale-price">{_regularPrice}</span>
                                </div>}
                            </td>
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