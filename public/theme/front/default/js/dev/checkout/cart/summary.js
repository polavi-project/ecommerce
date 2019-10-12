import A from "../../../../../../../js/production/a.js";
import Area from "../../../../../../../js/production/area.js";

function Subtotal({sub_total}) {
    return <tr>
        <td>Subtotal</td>
        <td>{sub_total}</td>
    </tr>
}
function Discount({discount_amount}) {
    return <tr>
        <td>Discount</td>
        <td>{discount_amount}</td>
    </tr>
}
function Tax({tax_amount}) {
    return <tr>
        <td>Tax</td>
        <td>{tax_amount}</td>
    </tr>
}

function GrandTotal({grand_total}) {
    return <tr>
        <td>Grand total</td>
        <td>{grand_total}</td>
    </tr>
}

function Summary(props) {
    return <div className="uk-width-1-4">
        <p><span>Summary</span></p>
        <table className={"uk-table"}>
            <Area
                id="shopping-cart-summary"
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
                reactcomponent={"tbody"}
            />
        </table>
        <p>
            <A classes={"uk-button uk-button-primary"} url={window.base_url + "/checkout"} text={"Checkout"}/>
        </p>
    </div>
}

export default Summary