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

export default function Shipment({ startShipUrl, completeShipUrl }) {
    const orderId = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.order_id'));
    const method = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.shipping_method'));
    const methodName = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.shipping_method_name'));
    const shippingNote = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.shipping_note'));
    const status = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.shipment_status'));
    const grandTotal = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.grand_total'));
    const weight = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.total_weight'));
    return React.createElement(
        "div",
        { className: "shipment-info uk-width-1-1 uk-margin-top" },
        React.createElement(
            "div",
            { className: "border-block" },
            React.createElement(
                "div",
                null,
                React.createElement(
                    "h3",
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
                        React.createElement(Area, {
                            id: "order_shipment_block_info_header",
                            orderId: orderId,
                            method: method,
                            shippingNote: shippingNote,
                            methodName: methodName,
                            grandTotal: grandTotal,
                            weight: weight,
                            status: status,
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
                            id: "order_shipment_info",
                            orderId: orderId,
                            method: method,
                            shippingNote: shippingNote,
                            methodName: methodName,
                            grandTotal: grandTotal,
                            weight: weight,
                            status: status,
                            noOuter: true,
                            coreWidgets: [{
                                'component': Status,
                                'props': { status: status },
                                'sort_order': 10,
                                'id': 'order_shipment_status'
                            }, {
                                'component': "td",
                                'props': { children: React.createElement(
                                        "span",
                                        null,
                                        methodName
                                    ) },
                                'sort_order': 20,
                                'id': 'order_shipment_method'
                            }, {
                                'component': Weight,
                                'props': { weight: weight },
                                'sort_order': 30,
                                'id': 'order_shipment_weight'
                            }, {
                                'component': Note,
                                'props': { note: shippingNote },
                                'sort_order': 40,
                                'id': 'order_shipment_note'
                            }, {
                                'component': Actions,
                                'props': { status: status, startShipUrl, completeShipUrl },
                                'sort_order': 50,
                                'id': 'order_shipment_action'
                            }]
                        })
                    )
                )
            )
        )
    );
}