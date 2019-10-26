import A from "../../../../../../../js/production/a.js";
import Area from "../../../../../../../js/production/area.js";

function Subtotal({ sub_total }) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _subTotal = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(sub_total);
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
            _subTotal
        )
    );
}
function Discount({ discount_amount }) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _discountAmount = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(discount_amount);

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
            _discountAmount
        )
    );
}
function Tax({ tax_amount }) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _taxAmount = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(tax_amount);

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
            _taxAmount
        )
    );
}

function GrandTotal({ grand_total }) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _grandTotal = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(grand_total);

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
            _grandTotal
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
                reactcomponent: "tbody",
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
                }]
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