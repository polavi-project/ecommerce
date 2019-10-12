import Area from "../../../../../../../../js/production/area.js";
import {Items} from "./items.js";
import {CartSummary} from "./cart.js";

function Title() {
    return <h2>Order summary</h2>
}

function Summary() {
    return <Area
        id={"checkout_summary"}
        className="uk-width-1-3"
        coreWidgets={[
            {
                'component': Title,
                'props': {},
                'sort_order': 10,
                'id': 'checkout_order_summary'
            },
            {
                'component': Items,
                'props': {},
                'sort_order': 20,
                'id': 'checkout_order_summary_items'
            },
            {
                'component': CartSummary,
                'props': {},
                'sort_order': 30,
                'id': 'checkout_order_summary_cart'
            }
        ]}
    />
}

export {Summary}