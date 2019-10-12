import Area from "../../../../../../../js/production/area.js";

function Pending({ status }) {
    if (status == 'pending') return React.createElement(
        "span",
        { className: "uk-label uk-label-warning" },
        React.createElement("span", { "uk-icon": "icon: tag; ratio: 0.8" }),
        " Pending"
    );else return null;
}

function Processing({ status }) {
    if (status == 'processing') return React.createElement(
        "span",
        { className: "uk-label" },
        React.createElement("span", { "uk-icon": "icon: tag; ratio: 0.8" }),
        " Processing"
    );else return null;
}

function Completed({ status }) {
    if (status == 'completed') return React.createElement(
        "span",
        { className: "uk-label uk-label-success" },
        React.createElement("span", { "uk-icon": "icon: tag; ratio: 0.8" }),
        " Completed"
    );else return null;
}

function Cancelled({ status }) {
    if (status == 'cancelled') return React.createElement(
        "span",
        { className: "uk-label uk-label-danger" },
        React.createElement("span", { "uk-icon": "icon: tag; ratio: 0.8" }),
        " Cancelled"
    );else return null;
}

function Status({ status }) {
    return React.createElement(Area, {
        id: "order-status",
        status: status,
        coreWidgets: [{
            component: Pending,
            props: {
                status
            },
            sort_order: 10,
            id: "order-status-pending"
        }, {
            component: Processing,
            props: {
                status
            },
            sort_order: 20,
            id: "order-status-processing"
        }, {
            component: Completed,
            props: {
                status
            },
            sort_order: 30,
            id: "order-status-completed"
        }, {
            component: Cancelled,
            props: {
                status
            },
            sort_order: 40,
            id: "order-status-cancelled"
        }]
    });
}

export { Status };