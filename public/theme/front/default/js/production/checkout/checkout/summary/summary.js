import Area from "../../../../../../../../js/production/area.js";
import { Items } from "./items.js";
import { CartSummary } from "./cart.js";

function Title() {
    return React.createElement(
        "h4",
        { className: "mb-4" },
        "Order summary"
    );
}

function Summary() {
    return React.createElement(Area, {
        id: "checkout_summary",
        className: "col-4",
        coreWidgets: [{
            'component': Title,
            'props': {},
            'sort_order': 10,
            'id': 'checkout_order_summary'
        }, {
            'component': Items,
            'props': {},
            'sort_order': 20,
            'id': 'checkout_order_summary_items'
        }, {
            'component': CartSummary,
            'props': {},
            'sort_order': 30,
            'id': 'checkout_order_summary_cart'
        }]
    });
}

export { Summary };