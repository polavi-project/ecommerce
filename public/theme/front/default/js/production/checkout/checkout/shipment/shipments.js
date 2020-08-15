import Area from "../../../../../../../../js/production/area.js";
import ShippingMethods from "./shipping_methods.js";
import { ShippingAddressBlock } from "./shipping_address.js";

function Title() {
    return React.createElement(
        "h4",
        { className: "mb-4" },
        "Shipment"
    );
}

function Shipment() {
    return React.createElement(Area, {
        id: "checkout_shipment",
        className: "col-12 col-md-4",
        coreWidgets: [{
            'component': Title,
            'props': {},
            'sort_order': 0,
            'id': 'shipment_block_title'
        }, {
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