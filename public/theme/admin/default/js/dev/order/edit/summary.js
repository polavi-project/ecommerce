import Area from "../../../../../../../js/production/area.js";

export default function OrderSummary(props) {
    const _taxAmount = new Intl.NumberFormat('en', { style: 'currency', currency: props.currency }).format(props.tax_amount);
    const _discountAmount = new Intl.NumberFormat('en', { style: 'currency', currency: props.currency }).format(props.discount_amount);
    const _subTotal = new Intl.NumberFormat('en', { style: 'currency', currency: props.currency }).format(props.sub_total);
    const _grandTotal = new Intl.NumberFormat('en', { style: 'currency', currency: props.currency }).format(props.grand_total);
    return <div className="sml-block mt-4">
        <div className="sml-block-title">Summary</div>
        <table className="table table-bordered">
            <tbody>
            <Area
                id={"order_summary_block"}
                orderId={props.order_id}
                currency={props.currency}
                grandTotal={props.grand_total}
                coupon={props.coupon}
                discountAmount={props.discount_amount}
                taxAmount={props.tax_amount}
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
                        'props': {children: [<td key="key"><span>Discount ({props.coupon})</span></td>, <td key="value"><span>{_discountAmount}</span></td>]},
                        'sort_order': 20,
                        'id': 'summary_discount'
                    },
                    {
                        'component': "tr",
                        'props': {children: [<td key="key"><span>Grand total</span></td>, <td key="value"><span>{_grandTotal}</span></td>]},
                        'sort_order': 30,
                        'id': 'summary_grand_total'
                    }
                ]}
            />
            </tbody>
        </table>
    </div>
}