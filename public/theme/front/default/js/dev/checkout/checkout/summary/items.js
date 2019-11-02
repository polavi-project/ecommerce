import A from "../../../../../../../../js/production/a.js";

function Items() {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));

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
                    const _total = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(item.total);

                    return <tr key={index}>
                        <td>
                            <A url={item.product_url} text={item.product_name} classes="uk-link-muted"/>
                        </td>
                        <td><span>{item.qty}</span></td>
                        <td><span>{_total}</span></td>
                    </tr>
                })
            }
            </tbody>
        </table>
    </div>
}
export {Items};