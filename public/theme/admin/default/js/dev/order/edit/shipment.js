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

export default function Shipment({startShipUrl, completeShipUrl}) {
    const orderId = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.order_id'));
    const method = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.shipping_method'));
    const methodName = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.shipping_method_name'));
    const shippingNote = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.shipping_note'));
    const status = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.shipment_status'));
    const grandTotal = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.grand_total'));
    const weight = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.total_weight'));
    return <div className='shipment-info uk-width-1-1 uk-margin-top'>
        <div className="border-block">
            <div><h3>Shipment</h3></div>
            <table className='uk-table uk-table-small'>
                <thead>
                    <tr>
                        <Area
                            id={"order_shipment_block_info_header"}
                            orderId={orderId}
                            method={method}
                            shippingNote={shippingNote}
                            methodName={methodName}
                            grandTotal={grandTotal}
                            weight={weight}
                            status={status}
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
                            id={"order_shipment_info"}
                            orderId={orderId}
                            method={method}
                            shippingNote={shippingNote}
                            methodName={methodName}
                            grandTotal={grandTotal}
                            weight={weight}
                            status={status}
                            noOuter={true}
                            coreWidgets={[
                                {
                                    'component': Status,
                                    'props': {status: status},
                                    'sort_order': 10,
                                    'id': 'order_shipment_status'
                                },
                                {
                                    'component': "td",
                                    'props': {children: <span>{methodName}</span>},
                                    'sort_order': 20,
                                    'id': 'order_shipment_method'
                                },
                                {
                                    'component': Weight,
                                    'props': {weight: weight},
                                    'sort_order': 30,
                                    'id': 'order_shipment_weight'
                                },
                                {
                                    'component': Note,
                                    'props': {note: shippingNote},
                                    'sort_order': 40,
                                    'id': 'order_shipment_note'
                                },
                                {
                                    'component': Actions,
                                    'props': {status: status, startShipUrl, completeShipUrl},
                                    'sort_order': 50,
                                    'id': 'order_shipment_action'
                                }
                            ]}
                        />
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
}