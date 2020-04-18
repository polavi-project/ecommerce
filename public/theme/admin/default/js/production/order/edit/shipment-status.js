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
        React.createElement('span', { 'uk-icon': 'icon: tag; ratio: 0.8' }),
        ' Pending'
    );else return null;
}

function Delivering({ status, noOuter = false }) {
    if (noOuter === true) return React.createElement(
        'option',
        { value: 'delivering' },
        'Delivering'
    );else if (status == 'delivering') return React.createElement(
        'span',
        { className: 'badge badge-success' },
        React.createElement('span', { 'uk-icon': 'icon: tag; ratio: 0.8' }),
        ' Delivering'
    );else return null;
}

function Delivered({ status, noOuter = false }) {
    if (noOuter === true) return React.createElement(
        'option',
        { value: 'delivered' },
        'Delivered'
    );else if (status == 'delivered') return React.createElement(
        'span',
        { className: 'badge badge-success' },
        React.createElement('span', { 'uk-icon': 'icon: tag; ratio: 0.8' }),
        ' Delivered'
    );else return null;
}

function ShipmentStatus(props) {
    if (props.noOuter === false) return React.createElement(Area, {
        id: 'shipment_status',
        coreWidgets: [{
            component: Pending,
            props: _extends({}, props),
            sort_order: 10,
            id: "shipment-status-pending"
        }, {
            component: Delivering,
            props: _extends({}, props),
            sort_order: 20,
            id: "shipment-status-delivering"
        }, {
            component: Delivered,
            props: _extends({}, props),
            sort_order: 30,
            id: "shipment-status-delivered"
        }]
    });else return React.createElement(Area, {
        id: 'shipment_status',
        noOuter: true,
        coreWidgets: [{
            component: Pending,
            props: _extends({}, props),
            sort_order: 10,
            id: "shipment-status-pending"
        }, {
            component: Delivering,
            props: _extends({}, props),
            sort_order: 20,
            id: "shipment-status-delivering"
        }, {
            component: Delivered,
            props: _extends({}, props),
            sort_order: 30,
            id: "shipment-status-delivered"
        }]
    });
}

export { ShipmentStatus };