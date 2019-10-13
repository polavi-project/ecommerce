import Area from "../../../../../../../../js/production/area.js";
import ShippingMethods from "./shipping_methods.js";
import {ShippingAddressBlock} from "./shipping_address.js";

function Title() {
    return <h3>Shipment</h3>
}

function Shipment() {
    return <Area
        id={"checkout_shipment"}
        className="uk-width-1-3"
        coreWidgets={[
            {
                'component': Title,
                'props': {},
                'sort_order': 0,
                'id': 'shipment_block_title'
            },
            {
                'component': ShippingAddressBlock,
                'props': {},
                'sort_order': 10,
                'id': 'shipping_address'
            },
            {
                'component': ShippingMethods,
                'props': {},
                'sort_order': 20,
                'id': 'shipment_methods'
            }
        ]}
    />
}

export {Shipment}