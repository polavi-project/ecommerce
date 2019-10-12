import A from "../../../../../../../../js/production/a.js";

function Items() {
    const items = ReactRedux.useSelector(state => _.get(state, 'appState.cart.items', []));
    return <div id="summary-items">
        <table className="uk-table uk-table-small">
            <thead>
            <tr>
                <td><span>Product</span></td>
                <td><span>Quantity</span></td>
                <td><span>Total</span></td>
            </tr>
            </thead>
            <tbody>
            {
                items.map((item, index) => {
                    return <tr key={index}>
                        <td>
                            <A url={item.product_url} text={item.product_name} classes="uk-link-muted"/>
                        </td>
                        <td><span>{item.qty}</span></td>
                        <td><span>{item.total}</span></td>
                    </tr>
                })
            }
            </tbody>
        </table>
    </div>
}
export {Items};