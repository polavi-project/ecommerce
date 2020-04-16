import Area from "../../../../../../../js/production/area.js";
import { OrderInfo } from "./info.js";
import { Payment } from "./payment.js";
import { OrderSummary } from "./summary.js";

export default function OrderEdit() {
    return React.createElement(
        "div",
        { className: "row order-edit-page" },
        React.createElement(Area, {
            id: "order_edit_left",
            className: "col-8",
            coreWidgets: [{
                component: OrderInfo,
                props: {},
                sort_order: 0,
                id: "order_info"
            }, {
                component: Payment,
                props: {},
                sort_order: 20,
                id: "order_payment_info"
            }]
        }),
        React.createElement(Area, {
            id: "order_edit_right",
            className: "col-4",
            coreWidgets: [{
                component: OrderSummary,
                props: {},
                sort_order: 5,
                id: "order_summary"
            }]
        })
    );
}