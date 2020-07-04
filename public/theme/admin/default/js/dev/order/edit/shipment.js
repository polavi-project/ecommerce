import Area from "../../../../../../../js/production/area.js";
import {ShipmentStatus} from "./shipment-status.js";
import {Fetch} from "../../../../../../../js/production/fetch.js";

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

function Actions({status, startShipUrl, completeShipUrl}) {
    const startShipment = (e) => {
        e.preventDefault();
        Fetch(
            startShipUrl,
            false,
            'GET',
            {},
            null,
            (response)=>{
                location.reload()
            })
    };

    const completeShipment = (e) => {
        e.preventDefault();
        Fetch(
            completeShipUrl,
            false,
            'GET',
            {},
            null,
            (response)=>{
                location.reload()
            })
    };
    return <td>
        {status == 'pending' && <a href="#" onClick={(e)=>startShipment(e)}><span>Start shipment</span></a>}
        {status == 'delivering' && <a href="#" onClick={(e)=>completeShipment(e)}><span>Complete shipment</span></a>}
    </td>
}

export default function Shipment(props) {
    const grandTotal = new Intl.NumberFormat('en', { style: 'currency', currency: props.currency }).format(props.grand_total);

    return <div className="sml-block mt-4">
        <div className="sml-block-title">Shipment</div>
        <table className='table table-bordered'>
            <thead>
            <tr>
                <Area
                    id={"order_shipment_block_info_header"}
                    orderId={props.order_id}
                    method={props.shipping_method}
                    shippingNote={props.shipping_note}
                    methodName={props.shipping_method_name}
                    grandTotal={grandTotal}
                    weight={props.total_weight}
                    status={props.shipment_status}
                    noOuter={true}
                    coreWidgets={[
                        {
                            'component': "th",
                            'props': {children: <span>Status</span>},
                            'sort_order': 10,
                            'id': 'shipment_status_header'
                        },
                        {
                            'component': "th",
                            'props': {children: <span>Method</span>},
                            'sort_order': 20,
                            'id': 'shipment_method_header'
                        },
                        {
                            'component': "th",
                            'props': {children: <span>Total weight</span>},
                            'sort_order': 30,
                            'id': 'shipment_weight_header'
                        },
                        {
                            'component': "th",
                            'props': {children: <span>Customer notes</span>},
                            'sort_order': 40,
                            'id': 'shipment_notes_header'
                        },
                        {
                            'component': "th",
                            'props': {children: <span>Actions</span>},
                            'sort_order': 50,
                            'id': 'shipment_action_header'
                        }
                    ]}
                />
            </tr>
            </thead>
            <tbody>
            <tr>
                <Area
                    id={"order_shipment_info_row"}
                    orderId={props.orderId}
                    method={props.shipping_method}
                    shippingNote={props.shipping_note}
                    methodName={props.shipping_method_name}
                    grandTotal={grandTotal}
                    weight={props.total_weight}
                    status={props.shipment_status}
                    noOuter={true}
                    coreWidgets={[
                        {
                            'component': Status,
                            'props': {status: props.shipment_status},
                            'sort_order': 10,
                            'id': 'order_shipment_status'
                        },
                        {
                            'component': "td",
                            'props': {children: <span>{props.shipping_method_name}</span>},
                            'sort_order': 20,
                            'id': 'order_shipment_method'
                        },
                        {
                            'component': Weight,
                            'props': {weight: props.total_weight},
                            'sort_order': 30,
                            'id': 'order_shipment_weight'
                        },
                        {
                            'component': Note,
                            'props': {note: props.shipping_note},
                            'sort_order': 40,
                            'id': 'order_shipment_note'
                        },
                        {
                            'component': Actions,
                            'props': {status: props.shipment_status, startShipUrl: props.startShipUrl, completeShipUrl: props.completeShipUrl},
                            'sort_order': 50,
                            'id': 'order_shipment_action'
                        }
                    ]}
                />
            </tr>
            </tbody>
        </table>
    </div>
}