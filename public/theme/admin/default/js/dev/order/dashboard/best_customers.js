import A from "../../../../../../../js/production/a.js";

export default function BestCustomers({customers, listUrl}) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency'));

    return <div className="sml-block mt-4">
        <div className="sml-block-title sml-flex-space-between">
            <div>Best customers</div>
            <div><A className="normal-font" url={listUrl}>All customers</A></div>
        </div>
        <table className="table table-bordered">
            <thead>
                <tr>
                    <th>Full name</th>
                    <th>Orders</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
            {customers.map((c, i) => {
                const _total = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(c.total);
                return <tr key={i}>
                    <td><A url={c.editUrl}>{c.full_name}</A></td>
                    <td>{c.orders}</td>
                    <td>{_total}</td>
                </tr>
            })}
            </tbody>
        </table>
    </div>
}