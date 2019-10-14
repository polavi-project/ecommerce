import Area from "../../../../../../../js/production/area.js";
import {OrderInfo} from "./info.js";
import {Payment} from "./payment.js";

export default function OrderEdit() {
    return <div className='uk-grid uk-grid-small order-edit-page'>
        <Area
            id='order_edit_left'
            className='uk-width-2-3'
            coreWidgets={[
                {
                    component: OrderInfo,
                    props : {},
                    sort_order: 0,
                    id: "order_info"
                },
                {
                    component: Payment,
                    props : {},
                    sort_order: 20,
                    id: "order_payment_info"
                }
            ]}
        />
        <Area
            id='order_edit_right'
            className='uk-width-1-3'
        />
    </div>
}