import Area from "../../../../../../../js/production/area.js";

function Pending({ status }) {
    if (status == 'pending') return React.createElement(
        "span",
        { className: "uk-label uk-label-warning" },
        React.createElement("span", { "uk-icon": "icon: tag; ratio: 0.8" }),
        " Pending"
    );else return null;
}

function Delivering({ status }) {
    if (status == 'delivering') return React.createElement(
        "span",
        { className: "uk-label uk-label-warning" },
        React.createElement("span", { "uk-icon": "icon: tag; ratio: 0.8" }),
        " Delivering"
    );else return null;
}

function Delivered({ status }) {
    if (status == 'delivered') return React.createElement(
        "span",
        { className: "uk-label uk-label-success" },
        React.createElement("span", { "uk-icon": "icon: tag; ratio: 0.8" }),
        " Delivered"
    );else return null;
}

function ShipmentStatus({ status }) {
    return React.createElement(Area, {
        id: "shipment-status",
        status: status,
        coreWidgets: [{
            component: Pending,
            props: {
                status
            },
            sort_order: 10,
            id: "shipment-status-pending"
        }, {
            component: Delivering,
            props: {
                status
            },
            sort_order: 20,
            id: "shipment-status-delivering"
        }, {
            component: Delivered,
            props: {
                status
            },
            sort_order: 30,
            id: "shipment-status-delivered"
        }]
    });
}

export { ShipmentStatus };