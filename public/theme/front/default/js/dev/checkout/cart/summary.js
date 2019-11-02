import A from "../../../../../../../js/production/a.js";
import Area from "../../../../../../../js/production/area.js";

function Subtotal({subTotal}) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _subTotal = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(subTotal);
    return <tr>
        <td>Subtotal</td>
        <td>{_subTotal}</td>
    </tr>
}
function Discount({discountAmount}) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _discountAmount = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(discountAmount);

    return <tr>
        <td>Discount</td>
        <td>{_discountAmount}</td>
    </tr>
}
function Tax({taxAmount}) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _taxAmount = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(taxAmount);

    return <tr>
        <td>Tax</td>
        <td>{_taxAmount}</td>
    </tr>
}

function GrandTotal({grandTotal}) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _grandTotal = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(grandTotal);

    return <tr>
        <td>Grand total</td>
        <td>{_grandTotal}</td>
    </tr>
}

function Summary(props) {
    const cart = ReactRedux.useSelector(state => _.get(state, 'appState.cart', {}));
    return <div className="uk-width-1-4">
        <p><span>Summary</span></p>
        <table className={"uk-table"}>
            <Area
                id="shopping-cart-summary"
                reactcomponent={"tbody"}
                cart={cart}
                coreWidgets={[
                    {
                        component: Subtotal,
                        props : {subTotal: cart.subTotal},
                        sort_order: 10,
                        id: "shopping-cart-subtotal"
                    },
                    {
                        component: Discount,
                        props : {discountAmount : cart.discountAmount},
                        sort_order: 20,
                        id: "shopping-cart-discount"
                    },
                    {
                        component: Tax,
                        props : {taxAmount : cart.taxAmount},
                        sort_order: 30,
                        id: "shopping-cart-tax"
                    },
                    {
                        component: GrandTotal,
                        props : {grandTotal : cart.grandTotal},
                        sort_order: 40,
                        id: "shopping-cart-grand-total"
                    }
                ]}
            />
        </table>
        <p>
            <A classes={"uk-button uk-button-primary"} url={props.checkoutUrl} text={"Checkout"}/>
        </p>
    </div>
}

export default Summary