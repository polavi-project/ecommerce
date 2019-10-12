import A from "../../../../../../../js/production/a.js";
import Area from "../../../../../../../js/production/area.js";

function Subtotal({ sub_total }) {
    return React.createElement(
        "tr",
        null,
        React.createElement(
            "td",
            null,
            "Subtotal"
        ),
        React.createElement(
            "td",
            null,
            sub_total
        )
    );
}
function Discount({ discount_amount }) {
    return React.createElement(
        "tr",
        null,
        React.createElement(
            "td",
            null,
            "Discount"
        ),
        React.createElement(
            "td",
            null,
            discount_amount
        )
    );
}
function Tax({ tax_amount }) {
    return React.createElement(
        "tr",
        null,
        React.createElement(
            "td",
            null,
            "Tax"
        ),
        React.createElement(
            "td",
            null,
            tax_amount
        )
    );
}

function GrandTotal({ grand_total }) {
    return React.createElement(
        "tr",
        null,
        React.createElement(
            "td",
            null,
            "Grand total"
        ),
        React.createElement(
            "td",
            null,
            grand_total
        )
    );
}

function Summary(props) {
    return React.createElement(
        "div",
        { className: "uk-width-1-4" },
        React.createElement(
            "p",
            null,
            React.createElement(
                "span",
                null,
                "Summary"
            )
        ),
        React.createElement(
            "table",
            { className: "uk-table" },
            React.createElement(Area, {
                id: "shopping-cart-summary",
                coreWidgets: [{
                    component: Subtotal,
                    props: { sub_total: props.sub_total },
                    sort_order: 10,
                    id: "shopping-cart-subtotal"
                }, {
                    component: Discount,
                    props: { discount_amount: props.discount_amount },
                    sort_order: 20,
                    id: "shopping-cart-discount"
                }],
                reactcomponent: "tbody"
            })
        ),
        React.createElement(
            "p",
            null,
            React.createElement(A, { classes: "uk-button uk-button-primary", url: window.base_url + "/checkout", text: "Checkout" })
        )
    );
}

export default Summary;