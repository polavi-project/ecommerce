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

function Paid({ status, isDropdown }) {
    if (isDropdown === true) return React.createElement(
        'option',
        { value: 'paid' },
        'Paid'
    );else if (status == 'paid') return React.createElement(
        'span',
        { className: 'uk-label uk-label-success' },
        React.createElement('span', { 'uk-icon': 'icon: tag; ratio: 0.8' }),
        ' Paid'
    );else return null;
}

function Refunded({ status, isDropdown }) {
    if (isDropdown === true) return React.createElement(
        'option',
        { value: 'refunded' },
        'Refunded'
    );else if (status == 'refunded') return React.createElement(
        'span',
        { className: 'uk-label uk-label-danger' },
        React.createElement('span', { 'uk-icon': 'icon: tag; ratio: 0.8' }),
        ' Refunded'
    );else return null;
}

// TODO: Check again this Area
function PaymentStatus({ status, isDropdown = false, wrapperProps = {} }) {
    if (isDropdown === false) return React.createElement(Area, {
        id: 'payment-status',
        status: status,
        isDropdown: isDropdown,
        coreWidgets: [{
            component: Pending,
            props: {
                status,
                isDropdown
            },
            sort_order: 10,
            id: "payment-status-pending"
        }, {
            component: Paid,
            props: {
                status,
                isDropdown
            },
            sort_order: 20,
            id: "payment-status-paid"
        }, {
            component: Refunded,
            props: {
                status,
                isDropdown
            },
            sort_order: 30,
            id: "payment-status-refunded"
        }]
    });else return React.createElement(Area, {
        id: 'payment-status',
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
            id: "payment-status-pending"
        }, {
            component: Paid,
            props: {
                status,
                isDropdown
            },
            sort_order: 20,
            id: "payment-status-paid"
        }, {
            component: Refunded,
            props: {
                status,
                isDropdown
            },
            sort_order: 30,
            id: "payment-status-refunded"
        }]
    });
}

export { PaymentStatus };