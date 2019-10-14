import Area from "../../../../../../../js/production/area.js";

export default function OrderEdit() {
    return React.createElement(
        'div',
        { className: 'uk-grid uk-grid-small order-edit-page' },
        React.createElement(Area, {
            id: 'order_edit_left',
            className: 'uk-width-2-3'
        }),
        React.createElement(Area, {
            id: 'order_edit_right',
            className: 'uk-width-1-3'
        })
    );
}