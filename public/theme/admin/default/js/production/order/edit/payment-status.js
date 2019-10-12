import Area from "../../../../../../../js/production/area.js";

function Pending({ status }) {
    if (status == 'pending') return React.createElement(
        "span",
        { className: "uk-label uk-label-warning" },
        React.createElement("span", { "uk-icon": "icon: tag; ratio: 0.8" }),
        " Pending"
    );else return null;
}

function Paid({ status }) {
    if (status == 'paid') return React.createElement(
        "span",
        { className: "uk-label uk-label-success" },
        React.createElement("span", { "uk-icon": "icon: tag; ratio: 0.8" }),
        " Paid"
    );else return null;
}

function Refunded({ status }) {
    if (status == 'refunded') return React.createElement(
        "span",
        { className: "uk-label uk-label-danger" },
        React.createElement("span", { "uk-icon": "icon: tag; ratio: 0.8" }),
        " Refunded"
    );else return null;
}

function PaymentStatus({ status }) {
    return React.createElement(Area, {
        id: "payment-status",
        status: status,
        coreWidgets: [{
            component: Pending,
            props: {
                status
            },
            sort_order: 10,
            id: "payment-status-pending"
        }, {
            component: Paid,
            props: {
                status
            },
            sort_order: 20,
            id: "payment-status-paid"
        }, {
            component: Refunded,
            props: {
                status
            },
            sort_order: 30,
            id: "payment-status-refunded"
        }]
    });
}

export { PaymentStatus };