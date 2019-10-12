export default function OrderSummary({tax_amount, discount_amount, coupon, grand_total}) {
    const _tax_amount = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(tax_amount);
    const _discount_amount = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(discount_amount);
    const _grand_total = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(grand_total);
    return <div className={"uk-width-1-1"}>
        <div className="uk-overflow-auto">
            <div><strong>Summary</strong></div>
            <table className="uk-table uk-table-small">
                <tbody>
                    <tr><td><span>Tax:</span></td><td><span>{_tax_amount}</span></td></tr>
                    { parseInt(discount_amount) > 0 &&
                    <tr><td><span>Discount <i>({coupon})</i>:</span></td><td><span>{_discount_amount}</span></td></tr>
                    }
                    <tr><td><span>Grand total:</span></td><td><span>{_grand_total}</span></td></tr>
                </tbody>
            </table>
        </div>
    </div>
}