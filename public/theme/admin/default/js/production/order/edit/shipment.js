import Area from "../../../../../../../js/production/area.js";
import { ShipmentStatus } from "./shipment-status.js";
import A from "../../../../../../../js/production/a.js";

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

function Cost({ cost }) {
    return React.createElement(
        "td",
        null,
        React.createElement(
            "span",
            null,
            "Shipping cost:"
        ),
        " ",
        cost
    );
}

function Actions({ status, startShipUrl, completeShipUrl }) {
    return React.createElement(
        "td",
        null,
        status == 'pending' && React.createElement(
            A,
            { pushState: false, url: startShipUrl },
            React.createElement(
                "span",
                null,
                "Start shipment"
            )
        ),
        status == 'delivering' && React.createElement(
            A,
            { pushState: false, url: completeShipUrl },
            React.createElement(
                "span",
                null,
                "Complete shipment"
            )
        )
    );
}

export default function Shipment({ order_id, shipping_fee, shipping_method, shipment_status, total_weight, shipping_note, grand_total, startShipUrl, completeShipUrl }) {
    return React.createElement(
        "div",
        { className: "shipment-info uk-width-1-1" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "strong",
                null,
                "Shipment"
            )
        ),
        React.createElement(
            "table",
            { className: "uk-table uk-table-small" },
            React.createElement(
                "thead",
                null,
                React.createElement(
                    "tr",
                    null,
                    React.createElement(
                        "th",
                        null,
                        "Status"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Method"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Total weight"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Cost"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Customer notes"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Actions"
                    )
                )
            ),
            React.createElement(
                "tbody",
                null,
                React.createElement(Area, {
                    id: "order_shipment_info",
                    order_id: order_id,
                    shipping_method: shipping_method,
                    shipping_fee: shipping_fee,
                    grand_total: grand_total,
                    total_weight: total_weight,
                    shipping_note: shipping_note,
                    shipment_status: shipment_status,
                    reactcomponent: "tr",
                    coreWidgets: [{
                        'component': Status,
                        'props': { status: shipment_status },
                        'sort_order': 10,
                        'id': 'order_shipment_status'
                    }, {
                        'component': Weight,
                        'props': { weight: total_weight },
                        'sort_order': 30,
                        'id': 'order_shipment_weight'
                    }, {
                        'component': Cost,
                        'props': { cost: shipping_fee },
                        'sort_order': 40,
                        'id': 'order_shipment_fee'
                    }, {
                        'component': Note,
                        'props': { note: shipping_note },
                        'sort_order': 50,
                        'id': 'order_shipment_note'
                    }, {
                        'component': Actions,
                        'props': { status: shipment_status, startShipUrl, completeShipUrl },
                        'sort_order': 60,
                        'id': 'order_shipment_action'
                    }]
                })
            )
        )
    );
}