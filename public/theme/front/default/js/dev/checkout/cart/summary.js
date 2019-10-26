import A from "../../../../../../../js/production/a.js";
import Area from "../../../../../../../js/production/area.js";

function Subtotal({sub_total}) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _subTotal = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(sub_total);
    return <tr>
        <td>Subtotal</td>
        <td>{_subTotal}</td>
    </tr>
}
function Discount({discount_amount}) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _discountAmount = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(discount_amount);

    return <tr>
        <td>Discount</td>
        <td>{_discountAmount}</td>
    </tr>
}
function Tax({tax_amount}) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _taxAmount = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(tax_amount);

    return <tr>
        <td>Tax</td>
        <td>{_taxAmount}</td>
    </tr>
}

function GrandTotal({grand_total}) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _grandTotal = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(grand_total);

    return <tr>
        <td>Grand total</td>
        <td>{_grandTotal}</td>
    </tr>
}

function Summary(props) {
    return <div className="uk-width-1-4">
        <p><span>Summary</span></p>
        <table className={"uk-table"}>
            <Area
                id="shopping-cart-summary"
                reactcomponent={"tbody"}
                coreWidgets={[
                    {
                        component: Subtotal,
                        props : {sub_total : props.sub_total},
                        sort_order: 10,
                        id: "shopping-cart-subtotal"
                    },
                    {
                        component: Discount,
                        props : {discount_amount : props.discount_amount},
                        sort_order: 20,
                        id: "shopping-cart-discount"
                    }
                ]}
            />
        </table>
        <p>
            <A classes={"uk-button uk-button-primary"} url={window.base_url + "/checkout"} text={"Checkout"}/>
        </p>
    </div>
}

export default Summary