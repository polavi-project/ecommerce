import Area from "../../../../../../../js/production/area.js";
import {PaymentStatus} from "./payment-status.js";

function Status({status}) {
    return <td>
        <PaymentStatus status={status}/>
    </td>
}

function Info({order_id, payment_method, payment_status, grand_total}) {
    return <div className='payment-info'>
        <div><strong>Information</strong></div>
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
                order_id={order_id}
                payment_method={payment_method}
                grand_total={grand_total}
                payment_status={payment_status}
                reactcomponent={"tr"}
                coreWidgets={[
                    {
                        'component': Status,
                        'props': {status: payment_status},
                        'sort_order': 10,
                        'id': 'order_payment_status'
                    }
                ]}
            />
            </tbody>
        </table>
    </div>
}

function Transaction({transactions}) {
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
                const amount = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(t.amount);
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

export default function Payment({order_id, payment_method, grand_total, payment_status, transactions}) {
    return <div className={"uk-width-1-1"}>
        <div><h3>Payment</h3></div>
        <div className="uk-overflow-auto">
            <Area
                id={"order_payment_block"}
                order_id={order_id}
                payment_method={payment_method}
                grand_total={grand_total}
                payment_status={payment_status}
                transactions={transactions}
                coreWidgets={[
                    {
                        'component': Info,
                        'props': {order_id, payment_method, payment_status, grand_total},
                        'sort_order': 10,
                        'id': 'order_payment_fo'
                    },
                    {
                        'component': Transaction,
                        'props': {transactions},
                        'sort_order': 20,
                        'id': 'order_payment_transaction'
                    }
                ]}
            />
        </div>
    </div>
}