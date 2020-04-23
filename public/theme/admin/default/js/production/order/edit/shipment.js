import Area from "../../../../../../../js/production/area.js";
import { ShipmentStatus } from "./shipment-status.js";
import { Fetch } from "../../../../../../../js/production/fetch.js";

function Status({ status }) {
    return React.createElement(
        "td",
        null,
        React.createElement(ShipmentStatus, { status: status })
    );
}

function Note({ note }) {
    return React.createElement(
        "td",
        null,
        React.createElement(
            "i",
            null,
            note
        )
    );
}

function Weight({ weight }) {
    return React.createElement(
        "td",
        null,
        weight
    );
}

function Actions({ status, startShipUrl, completeShipUrl }) {
    const startShipment = e => {
        e.preventDefault();
        Fetch(startShipUrl, false, 'GET', {}, null, response => {
            location.reload();
        });
    };

    const completeShipment = e => {
        e.preventDefault();
        Fetch(completeShipUrl, false, 'GET', {}, null, response => {
            location.reload();
        });
    };
    return React.createElement(
        "td",
        null,
        status == 'pending' && React.createElement(
            "a",
            { href: "#", onClick: e => startShipment(e) },
            React.createElement(
                "span",
                null,
                "Start shipment"
            )
        ),
        status == 'delivering' && React.createElement(
            "a",
            { href: "#", onClick: e => completeShipment(e) },
            React.createElement(
                "span",
                null,
                "Complete shipment"
            )
        )
    );
}

export default function Shipment(props) {
    const grandTotal = new Intl.NumberFormat('en', { style: 'currency', currency: props.currency }).format(props.grand_total);

    return React.createElement(
        "div",
        { className: "sml-block mt-4" },
        React.createElement(
            "div",
            { className: "sml-block-title" },
            "Shipment"
        ),
        React.createElement(
            "table",
            { className: "table table-bordered" },
            React.createElement(
                "thead",
                null,
                React.createElement(
                    "tr",
                    null,
                    React.createElement(Area, {
                        id: "order_shipment_block_info_header",
                        orderId: props.order_id,
                        method: props.shipping_method,
                        shippingNote: props.shipping_note,
                        methodName: props.shipping_method_name,
                        grandTotal: grandTotal,
                        weight: props.total_weight,
                        status: props.shipment_status,
                        noOuter: true,
                        coreWidgets: [{
                            'component': "th",
                            'props': { children: React.createElement(
                                    "span",
                                    null,
                                    "Status"
                                ) },
                            'sort_order': 10,
                            'id': 'shipment_status_header'
                        }, {
                            'component': "th",
                            'props': { children: React.createElement(
                                    "span",
                                    null,
                                    "Method"
                                ) },
                            'sort_order': 20,
                            'id': 'shipment_method_header'
                        }, {
                            'component': "th",
                            'props': { children: React.createElement(
                                    "span",
                                    null,
                                    "Total weight"
                                ) },
                            'sort_order': 30,
                            'id': 'shipment_weight_header'
                        }, {
                            'component': "th",
                            'props': { children: React.createElement(
                                    "span",
                                    null,
                                    "Customer notes"
                                ) },
                            'sort_order': 40,
                            'id': 'shipment_notes_header'
                        }, {
                            'component': "th",
                            'props': { children: React.createElement(
                                    "span",
                                    null,
                                    "Actions"
                                ) },
                            'sort_order': 50,
                            'id': 'shipment_action_header'
                        }]
                    })
                )
            ),
            React.createElement(
                "tbody",
                null,
                React.createElement(
                    "tr",
                    null,
                    React.createElement(Area, {
                        id: "order_shipment_info_row",
                        orderId: props.orderId,
                        method: props.shipping_method,
                        shippingNote: props.shipping_note,
                        methodName: props.shipping_method_name,
                        grandTotal: grandTotal,
                        weight: props.total_weight,
                        status: props.shipment_status,
                        noOuter: true,
                        coreWidgets: [{
                            'component': Status,
                            'props': { status: props.shipment_status },
                            'sort_order': 10,
                            'id': 'order_shipment_status'
                        }, {
                            'component': "td",
                            'props': { children: React.createElement(
                                    "span",
                                    null,
                                    props.shipping_method_name
                                ) },
                            'sort_order': 20,
                            'id': 'order_shipment_method'
                        }, {
                            'component': Weight,
                            'props': { weight: props.total_weight },
                            'sort_order': 30,
                            'id': 'order_shipment_weight'
                        }, {
                            'component': Note,
                            'props': { note: props.shipping_note },
                            'sort_order': 40,
                            'id': 'order_shipment_note'
                        }, {
                            'component': Actions,
                            'props': { status: props.shipment_status, startShipUrl: props.startShipUrl, completeShipUrl: props.completeShipUrl },
                            'sort_order': 50,
                            'id': 'order_shipment_action'
                        }]
                    })
                )
            )
        )
    );
}