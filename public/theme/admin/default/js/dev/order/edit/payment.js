import Area from "../../../../../../../js/production/area.js";
import {PaymentStatus} from "./payment-status.js";

function Status({status}) {
    return <td>
        <PaymentStatus status={status}/>
    </td>
}

function Info({orderId, method, methodName, status, grandTotal}) {
    return <div className='payment-info'>
        <table className='uk-table uk-table-small'>
            <thead>
            <tr>
                <th>Status</th>
                <th>Method</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <Area
                id={"order_payment_block_info"}
                orderId={orderId}
                method={method}
                methodName={methodName}
                grandTotal={grandTotal}
                status={status}
                reactcomponent={"tr"}
                coreWidgets={[
                    {
                        'component': Status,
                        'props': {status: status},
                        'sort_order': 10,
                        'id': 'order_payment_status'
                    },
                    {
                        'component': "td",
                        'props': {children: <span>{methodName}</span>},
                        'sort_order': 20,
                        'id': 'order_payment_method'
                    }
                ]}
            />
            </tbody>
        </table>
    </div>
}

export default function Transaction({transactions}) {
    const status = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.payment_status'));
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.currency', 'USD'));
    return <div className='payment-transactions'>
        <div><span uk-icon="credit-card"></span> <strong>Payment transactions</strong></div>
        <table className="uk-table uk-table-small">
            <thead>
                <tr>
                    <th><span>Date</span></th>
                    <th><span>Type</span></th>
                    <th><span>Code</span></th>
                    <th><span>Amount</span></th>
                    <th><span>Action</span></th>
                </tr>
            </thead>
            <tbody>
            { transactions.map((t,i) => {
                let date = new Date(t.created_at);
                const amount = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(t.amount);
                return <tr key={i}>
                    <td><span>{date.toDateString()}</span></td>
                    <td>
                        {t.transaction_type === 'online' && <span uk-tooltip={t.transaction_type} uk-icon="credit-card"></span>}
                        {t.transaction_type === 'offline' && <span uk-tooltip={t.transaction_type} uk-icon="file-text"></span>}
                    </td>
                    <td>
                        {t.parent_transaction_id && <span>{t.parent_transaction_id}</span>}
                        {!t.parent_transaction_id && <span>---</span>}
                    </td>
                    <td><span>{amount}</span></td>
                    <td><span>{t.payment_action}</span></td>
                </tr>
            })}
            {transactions.length === 0 && <tr><td colSpan="100"><div>There is no transaction to display</div></td></tr>}
            </tbody>
        </table>
    </div>
}

function Payment() {
    const orderId = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.order_id'));
    const method = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.payment_method'));
    const methodName = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.payment_method_name'));
    const status = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.payment_status'));
    const grandTotal = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.grand_total'));
    return <div className={"uk-width-1-1"}>
        <div><h3>Payment</h3></div>
        <div className="uk-overflow-auto">
            <Area
                id={"order_payment_block"}
                orderId={orderId}
                method={method}
                methodName={methodName}
                grandTotal={grandTotal}
                status={status}
                coreWidgets={[
                    {
                        'component': Info,
                        'props': {orderId, method, methodName, status, grandTotal},
                        'sort_order': 10,
                        'id': 'order_payment_fo'
                    }
                ]}
            />
        </div>
    </div>
}

export {Payment}