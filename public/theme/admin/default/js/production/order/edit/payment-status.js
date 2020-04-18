var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Area from "../../../../../../../js/production/area.js";

function Pending({ status, noOuter = false }) {
    if (noOuter === true) return React.createElement(
        'option',
        { value: 'pending' },
        'Pending'
    );else if (status == 'pending') return React.createElement(
        'span',
        { className: 'badge badge-secondary' },
        React.createElement('i', { className: 'fas fa-tag' }),
        ' Pending'
    );else return null;
}

function Paid({ status, noOuter = false }) {
    if (noOuter === true) return React.createElement(
        'option',
        { value: 'paid' },
        'Paid'
    );else if (status == 'paid') return React.createElement(
        'span',
        { className: 'badge badge-success' },
        React.createElement('i', { className: 'fas fa-tag' }),
        ' Paid'
    );else return null;
}

function Refunded({ status, noOuter = false }) {
    if (noOuter === true) return React.createElement(
        'option',
        { value: 'refunded' },
        'Refunded'
    );else if (status == 'refunded') return React.createElement(
        'span',
        { className: 'badge badge-danger' },
        React.createElement('i', { className: 'fas fa-tag' }),
        ' Refunded'
    );else return null;
}

// TODO: Check again this Area
function PaymentStatus(props) {
    if (props.noOuter === false) return React.createElement(Area, _extends({
        id: 'payment_status',
        coreWidgets: [{
            component: Pending,
            props: _extends({}, props),
            sort_order: 10,
            id: "payment-status-pending"
        }, {
            component: Paid,
            props: _extends({}, props),
            sort_order: 20,
            id: "payment-status-paid"
        }, {
            component: Refunded,
            props: _extends({}, props),
            sort_order: 30,
            id: "payment-status-refunded"
        }]
    }, props));else return React.createElement(Area, _extends({
        id: 'payment_status',
        noOuter: true,
        coreWidgets: [{
            component: Pending,
            props: _extends({}, props),
            sort_order: 10,
            id: "payment-status-pending"
        }, {
            component: Paid,
            props: _extends({}, props),
            sort_order: 20,
            id: "payment-status-paid"
        }, {
            component: Refunded,
            props: _extends({}, props),
            sort_order: 30,
            id: "payment-status-refunded"
        }]
    }, props));
}

export { PaymentStatus };