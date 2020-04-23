import Area from "../../../../../../../js/production/area.js";

export default function OrderEdit() {
    return React.createElement(
        'div',
        { className: 'row order-edit-page' },
        React.createElement(Area, {
            id: 'order_edit_left',
            className: 'col-8',
            coreWidgets: []
        }),
        React.createElement(Area, {
            id: 'order_edit_right',
            className: 'col-4',
            coreWidgets: []
        })
    );
}