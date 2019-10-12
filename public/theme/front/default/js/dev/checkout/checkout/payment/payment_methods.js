import Area from "../../../../../../../../js/production/area.js";

function Title() {
    return <h2>Payment methods</h2>
}

export default function PaymentMethods() {
    return <Area
        id="checkout_payment_method_block"
        className="uk-width-1-1 checkout-payment-methods"
        coreWidgets={[
            {
                component: Title,
                props : {},
                sort_order: 0,
                id: "payment_method_block_title"
            }
        ]}
    />
}