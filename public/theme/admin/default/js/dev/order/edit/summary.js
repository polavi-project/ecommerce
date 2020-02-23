import Area from "../../../../../../../js/production/area.js";

function OrderSummary() {
    const orderId = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.order_id'));
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.currency'));
    const coupon = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.coupon'));
    const discountAmount = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.discount_amount'));
    const taxAmount = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.tax_amount'));
    const subTotal = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.sub_total'));
    const grandTotal = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.grand_total'));


    const _taxAmount = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(taxAmount);
    const _discountAmount = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(discountAmount);
    const _subTotal = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(subTotal);
    const _grandTotal = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(grandTotal);
    return <div className={"uk-width-1-1"}>
        <div className="uk-overflow-auto border-block">
            <div><h3>Summary</h3></div>
            <table className="uk-table uk-table-small uk-table-divider">
                <tbody>
                <Area
                    id={"order_summary_block"}
                    orderId={orderId}
                    currency={currency}
                    grandTotal={grandTotal}
                    coupon={coupon}
                    discountAmount={discountAmount}
                    taxAmount={taxAmount}
                    noOuter={true}
                    coreWidgets={[
                        {
                            'component': "tr",
                            'props': {children: [<td key="key"><span>Subtotal</span></td>, <td key="value"><span>{_subTotal}</span></td>]},
                            'sort_order': 5,
                            'id': 'summary_subtotal'
                        },
                        {
                            'component': "tr",
                            'props': {children: [<td key="key"><span>Tax</span></td>, <td key="value"><span>{_taxAmount}</span></td>]},
                            'sort_order': 10,
                            'id': 'summary_tax'
                        },
                        {
                            'component': "tr",
                            'props': {children: [<td key="key"><span>Discount ({coupon})</span></td>, <td key="value"><span>{_discountAmount}</span></td>]},
                            'sort_order': 20,
                            'id': 'summary_discount'
                        },
                        {
                            'component': "tr",
                            'props': {children: [<td key="key"><span>Grand total</span></td>, <td key="value"><span>{_grandTotal}</span></td>]},
                            'sort_order': 20,
                            'id': 'summary_grand_total'
                        }
                    ]}
                />
                </tbody>
            </table>
        </div>
    </div>
}

export {OrderSummary}