import A from "../../../../../../../js/production/a.js";
import Area from "../../../../../../../js/production/area.js";

function Subtotal({ subTotal }) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _subTotal = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(subTotal);
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
function Discount({ discountAmount }) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _discountAmount = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(discountAmount);

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
function Tax({ taxAmount }) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _taxAmount = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(taxAmount);

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

function GrandTotal({ grandTotal }) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const _grandTotal = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(grandTotal);

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
    const cart = ReactRedux.useSelector(state => _.get(state, 'appState.cart', {}));
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
                cart: cart,
                coreWidgets: [{
                    component: Subtotal,
                    props: { subTotal: cart.subTotal },
                    sort_order: 10,
                    id: "shopping-cart-subtotal"
                }, {
                    component: Discount,
                    props: { discountAmount: cart.discountAmount },
                    sort_order: 20,
                    id: "shopping-cart-discount"
                }, {
                    component: Tax,
                    props: { taxAmount: cart.taxAmount },
                    sort_order: 30,
                    id: "shopping-cart-tax"
                }, {
                    component: GrandTotal,
                    props: { grandTotal: cart.grandTotal },
                    sort_order: 40,
                    id: "shopping-cart-grand-total"
                }]
            })
        ),
        React.createElement(
            "p",
            null,
            React.createElement(A, { classes: "uk-button uk-button-primary", url: props.checkoutUrl, text: "Checkout" })
        )
    );
}

export default Summary;