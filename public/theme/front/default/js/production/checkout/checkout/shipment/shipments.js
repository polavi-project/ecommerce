import Area from "../../../../../../../../js/production/area.js";
import ShippingMethods from "./shipping_methods.js";
import { ShippingAddressBlock } from "./shipping_address.js";

function Shipment() {
    return React.createElement(Area, {
        id: "checkout_shipment",
        className: "uk-width-1-2",
        coreWidgets: [{
            'component': ShippingAddressBlock,
            'props': {},
            'sort_order': 10,
            'id': 'shipping_address'
        }, {
            'component': ShippingMethods,
            'props': {},
            'sort_order': 20,
            'id': 'shipment_methods'
        }]
    });
}

export { Shipment };