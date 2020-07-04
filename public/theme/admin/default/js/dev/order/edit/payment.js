import Area from "../../../../../../../js/production/area.js";
import {PaymentStatus} from "./payment-status.js";

function Status({status}) {
    return <td>
        <PaymentStatus status={status}/>
    </td>
}

function Info({orderId, method, methodName, status, grandTotal}) {
    return <div className='payment-info'>
        <table className='table table-bordered'>
            <thead>
                <tr>
                    <Area
                        id={"order_payment_block_info_header"}
                        orderId={orderId}
                        method={method}
                        methodName={methodName}
                        grandTotal={grandTotal}
                        status={status}
                        noOuter={true}
                        coreWidgets={[
                            {
                                'component': "th",
                                'props': {children: <span>Status</span>},
                                'sort_order': 10,
                                'id': 'payment_status_header'
                            },
                            {
                                'component': "th",
                                'props': {children: <span>Method</span>},
                                'sort_order': 20,
                                'id': 'payment_method_header'
                            },
                            {
                                'component': "th",
                                'props': {children: <span>Actions</span>},
                                'sort_order': 30,
                                'id': 'payment_action_header'
                            }
                        ]}
                    />
                </tr>
            </thead>
            <tbody>
                <tr>
                    <Area
                        id={"order_payment_block_info"}
                        orderId={orderId}
                        method={method}
                        methodName={methodName}
                        grandTotal={grandTotal}
                        status={status}
                        noOuter={true}
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
                </tr>
            </tbody>
        </table>
    </div>
}

function Transaction({transactions, currency}) {
    return <div className='payment-transactions'>
        <div><i className="fas fa-credit-card"></i> Payment transactions</div>
        <table className="table table-bordered">
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

export default function Payment(props) {
    const grandTotal = new Intl.NumberFormat('en', { style: 'currency', currency: props.currency }).format(props.grandTotal);
    return <div className="sml-block mt-4">
        <div className="sml-block-title">Payment</div>
        <div className="overflow-auto">
            <Area
                id={"order_payment_block"}
                orderId={props.orderId}
                method={props.method}
                methodName={props.methodName}
                grandTotal={grandTotal}
                status={props.status}
                coreWidgets={[
                    {
                        'component': Info,
                        'props': {...props},
                        'sort_order': 10,
                        'id': 'order_payment_fo'
                    },
                    {
                        'component': Transaction,
                        'props': {transactions : props.payment_transactions, currency: props.currency},
                        'sort_order': 20,
                        'id': 'order_payment_transaction'
                    }
                ]}
            />
        </div>
    </div>
}