import Area from "../../../../../../../js/production/area.js";
import {ShipmentStatus} from "./shipment-status.js";
import A from "../../../../../../../js/production/a.js";

function Status({status}) {
    return <td>
        <ShipmentStatus status={status}/>
    </td>
}

function Note({note}) {
    return <td>
        <i>{note}</i>
    </td>
}

function Weight({weight}) {
    return <td>{weight}</td>
}

function Cost({cost}) {
    return <td><span>Shipping cost:</span> {cost}</td>
}

function Actions({status, startShipUrl, completeShipUrl}) {
    return <td>
        {status == 'pending' && <A pushState={false} url={startShipUrl}><span>Start shipment</span></A>}
        {status == 'delivering' && <A pushState={false} url={completeShipUrl}><span>Complete shipment</span></A>}
    </td>
}

export default function Shipment({order_id, shipping_fee, shipping_method, shipment_status, total_weight, shipping_note, grand_total, startShipUrl, completeShipUrl}) {
    return <div className='shipment-info uk-width-1-1'>
        <div><strong>Shipment</strong></div>
        <table className='uk-table uk-table-small'>
            <thead>
            <tr>
                <th>Status</th>
                <th>Method</th>
                <th>Total weight</th>
                <th>Cost</th>
                <th>Customer notes</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <Area
                id={"order_shipment_info"}
                order_id={order_id}
                shipping_method={shipping_method}
                shipping_fee={shipping_fee}
                grand_total={grand_total}
                total_weight={total_weight}
                shipping_note={shipping_note}
                shipment_status={shipment_status}
                reactcomponent={"tr"}
                coreWidgets={[
                    {
                        'component': Status,
                        'props': {status: shipment_status},
                        'sort_order': 10,
                        'id': 'order_shipment_status'
                    },
                    {
                        'component': Weight,
                        'props': {weight: total_weight},
                        'sort_order': 30,
                        'id': 'order_shipment_weight'
                    },
                    {
                        'component': Cost,
                        'props': {cost: shipping_fee},
                        'sort_order': 40,
                        'id': 'order_shipment_fee'
                    },
                    {
                        'component': Note,
                        'props': {note: shipping_note},
                        'sort_order': 50,
                        'id': 'order_shipment_note'
                    },
                    {
                        'component': Actions,
                        'props': {status: shipment_status, startShipUrl, completeShipUrl},
                        'sort_order': 60,
                        'id': 'order_shipment_action'
                    }
                ]}
            />
            </tbody>
        </table>
    </div>
}