import Area from "../../../../../../../js/production/area.js";

function Pending({ status, isDropdown }) {
    if (isDropdown === true) return React.createElement(
        'option',
        { value: 'pending' },
        'Pending'
    );else if (status == 'pending') return React.createElement(
        'span',
        { className: 'uk-label uk-label-warning' },
        React.createElement('span', { 'uk-icon': 'icon: tag; ratio: 0.8' }),
        ' Pending'
    );else return null;
}

function Delivering({ status, isDropdown }) {
    if (isDropdown === true) return React.createElement(
        'option',
        { value: 'delivering' },
        'Delivering'
    );else if (status == 'delivering') return React.createElement(
        'span',
        { className: 'uk-label uk-label-warning' },
        React.createElement('span', { 'uk-icon': 'icon: tag; ratio: 0.8' }),
        ' Delivering'
    );else return null;
}

function Delivered({ status, isDropdown }) {
    if (isDropdown === true) return React.createElement(
        'option',
        { value: 'delivered' },
        'Delivered'
    );else if (status == 'delivered') return React.createElement(
        'span',
        { className: 'uk-label uk-label-success' },
        React.createElement('span', { 'uk-icon': 'icon: tag; ratio: 0.8' }),
        ' Delivered'
    );else return null;
}

function ShipmentStatus({ status, isDropdown = false, wrapperProps = {} }) {
    if (isDropdown === false) return React.createElement(Area, {
        id: 'shipment-status',
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
    });else return React.createElement(Area, {
        id: 'shipment-status',
        status: status,
        reactcomponent: "select",
        wrapperProps: wrapperProps,
        coreWidgets: [{
            component: Pending,
            props: {
                status,
                isDropdown
            },
            sort_order: 10,
            id: "shipment-status-pending"
        }, {
            component: Delivering,
            props: {
                status,
                isDropdown
            },
            sort_order: 20,
            id: "shipment-status-delivering"
        }, {
            component: Delivered,
            props: {
                status,
                isDropdown
            },
            sort_order: 30,
            id: "shipment-status-delivered"
        }]
    });
}

export { ShipmentStatus };