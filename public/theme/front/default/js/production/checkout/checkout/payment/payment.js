import Area from "../../../../../../../../js/production/area.js";
import PaymentMethods from "./payment_methods.js";
import { BillingAddressBlock } from "./billing_address.js";

function Payment() {
    return React.createElement(Area, {
        id: "checkout_payment",
        className: "uk-width-1-3",
        coreWidgets: [{
            'component': PaymentMethods,
            'props': {},
            'sort_order': 10,
            'id': 'payment_methods'
        }, {
            'component': BillingAddressBlock,
            'props': {},
            'sort_order': 20,
            'id': 'billing_address'
        }]
    });
}

export { Payment };