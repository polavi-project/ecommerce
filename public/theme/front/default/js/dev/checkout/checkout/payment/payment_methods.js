import Area from "../../../../../../../../js/production/area.js";

function Title() {
    return <div><strong>Payment methods</strong></div>
}

export default function PaymentMethods() {
    return <Area
        id="checkout_payment_method_block"
        className="checkout-payment-methods"
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