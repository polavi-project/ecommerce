import Area from "../../../../../../../../js/production/area.js";

function Subtotal({subTotal}) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _subTotal = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(subTotal);

    return <tr>
        <td>Subtotal</td>
        <td><span>{_subTotal}</span></td>
    </tr>
}

function Discount({discountAmount}) {
    if(discountAmount === 0)
        return null;

    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _discountAmount = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(discountAmount);

    return <tr>
        <td>Discount</td>
        <td><span>{_discountAmount}</span></td>
    </tr>
}

function ShippingFee({shippingFee}) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _shippingFee = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(shippingFee);

    return <tr>
        <td>Shipping</td>
        <td><span>{shippingFee === 0 && "Free"}{shippingFee !== 0 && _shippingFee}</span></td>
    </tr>
}

function Tax({taxAmount}) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _taxAmount = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(taxAmount);

    return <tr>
        <td>Tax</td>
        <td><span>{_taxAmount}</span></td>
    </tr>
}

function GrandTotal({grandTotal}) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _grandTotal = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(grandTotal);

    return <tr>
        <td>Grand total</td>
        <td><span>{_grandTotal}</span></td>
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