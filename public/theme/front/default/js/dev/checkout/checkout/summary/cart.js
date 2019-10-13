import Area from "../../../../../../../../js/production/area.js";

function Subtotal({subTotal}) {
    return <tr>
        <td>Subtotal</td>
        <td><span>{subTotal}</span></td>
    </tr>
}

function Discount({discountAmount}) {
    if(discountAmount === 0)
        return null;
    return <tr>
        <td>Discount</td>
        <td><span>{discountAmount}</span></td>
    </tr>
}

function ShippingFee({shippingFee}) {
    return <tr>
        <td>Shipping</td>
        <td><span>{shippingFee === 0 && "Free"}{shippingFee !== 0 && shippingFee}</span></td>
    </tr>
}

function Tax({taxAmount}) {
    return <tr>
        <td>Tax</td>
        <td><span>{taxAmount}</span></td>
    </tr>
}

function GrandTotal({grandTotal}) {
    return <tr>
        <td>Grand total</td>
        <td><span>{grandTotal}</span></td>
    </tr>
}

function CartSummary() {
    const cart = ReactRedux.useSelector(state => _.get(state, 'appState.cart', {}));
    return <div className="checkout-summary-cart">
        <table className="uk-table uk-table-small checkout-cart-summary-table">
            <Area
                id={"checkout_summary_cart"}
                reactcomponent="tbody"
                coreWidgets={[
                    {
                        'component': Subtotal,
                        'props': {...cart},
                        'sort_order': 10,
                        'id': 'checkout_order_summary_cart_subtotal'
                    },
                    {
                        'component': Discount,
                        'props': {...cart},
                        'sort_order': 20,
                        'id': 'checkout_order_summary_cart_discount'
                    },
                    {
                        'component': ShippingFee,
                        'props': {...cart},
                        'sort_order': 30,
                        'id': 'checkout_order_summary_cart_shipping'
                    },
                    {
                        'component': Tax,
                        'props': {...cart},
                        'sort_order': 40,
                        'id': 'checkout_order_summary_cart_tax'
                    },
                    {
                        'component': GrandTotal,
                        'props': {...cart},
                        'sort_order': 50,
                        'id': 'checkout_order_summary_cart_grand_total'
                    }
                ]}
            />
        </table>
    </div>
}

export {CartSummary}