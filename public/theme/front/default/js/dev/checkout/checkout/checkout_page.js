import Area from "../../../../../../../js/production/area.js";
import {Shipment} from "./shipment/shipments.js";
import {Payment} from "./payment/payment.js";

export default function CheckoutPage() {
    return <Area
        id={"checkout_page"}
        className="uk-grid-small uk-grid"
        coreWidgets={[
            {
                'component': Shipment,
                'props': {},
                'sort_order': 10,
                'id': 'shipment_block'
            },
            {
                'component': Payment,
                'props': {},
                'sort_order': 20,
                'id': 'payment_block'
            }
        ]}
    />
}