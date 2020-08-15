import A from "../../../../../../../js/production/a.js";

export default function BestSellers({products, listUrl}) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency'));
    return <div className="sml-block mt-4">
        <div className="sml-block-title sml-flex-space-between">
            <div>Best sellers</div>
            <div><A className="normal-font" url={listUrl}>All products</A></div>
        </div>
        <table className="table table-bordered">
            <thead>
                <tr>
                    <th>Product name</th>
                    <th>Sku</th>
                    <th>Price</th>
                    <th>Sold Quantity</th>
                </tr>
            </thead>
            <tbody>
            {products.map((p, i) => {
                const _price = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(p.price);
                return <tr key={i}>
                    <td><A url={p.editUrl}>{p.name}</A></td>
                    <td>{p.sku}</td>
                    <td>{_price}</td>
                    <td>{p.qty}</td>
                </tr>
            })}
            </tbody>
        </table>
    </div>
}