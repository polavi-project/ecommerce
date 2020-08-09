import Area from "../../../../../../../js/production/area.js";
import { Shipment } from "./shipment/shipments.js";
import { Payment } from "./payment/payment.js";
import { Summary } from "./summary/summary.js";

export default function CheckoutPage() {
    return React.createElement(Area, {
        id: "checkout_page",
        className: "row",
        coreWidgets: [{
            'component': Shipment,
            'props': {},
            'sort_order': 10,
            'id': 'shipment_block'
        }, {
            'component': Payment,
            'props': {},
            'sort_order': 20,
            'id': 'payment_block'
        }, {
            'component': Summary,
            'props': {},
            'sort_order': 30,
            'id': 'summary_block'
        }]
    });
}