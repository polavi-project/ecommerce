import Area from "../../../../../../../../js/production/area.js";

function Title() {
    return React.createElement(
        "h2",
        null,
        "Payment methods"
    );
}

export default function PaymentMethods() {
    return React.createElement(Area, {
        id: "checkout_payment_method_block",
        className: "uk-width-1-1 checkout-payment-methods",
        coreWidgets: [{
            component: Title,
            props: {},
            sort_order: 0,
            id: "payment_method_block_title"
        }]
    });
}