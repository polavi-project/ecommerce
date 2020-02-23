import Area from "../../../../../../../js/production/area.js";

function Pending({status, noOuter = false}) {
    if(noOuter === true)
        return <option value='pending'>Pending</option>;
    else if(status == 'pending')
        return <span className="uk-label uk-label-warning"><span uk-icon="icon: tag; ratio: 0.8"></span> Pending</span>;
    else
        return null;
}

function Delivering({status, noOuter = false}) {
    if(noOuter === true)
        return <option value='delivering'>Delivering</option>;
    else if(status == 'delivering')
        return <span className="uk-label uk-label-warning"><span uk-icon="icon: tag; ratio: 0.8"></span> Delivering</span>;
    else
        return null;
}

function Delivered({status, noOuter = false}) {
    if(noOuter === true)
        return <option value='delivered'>Delivered</option>;
    else if(status == 'delivered')
        return <span className="uk-label uk-label-success"><span uk-icon="icon: tag; ratio: 0.8"></span> Delivered</span>;
    else
        return null;
}

function ShipmentStatus(props) {
    if(props.noOuter === false)
        return <Area
            id="shipment_status"
            coreWidgets={[
                {
                    component: Pending,
                    props : {
                        ...props
                    },
                    sort_order: 10,
                    id: "shipment-status-pending"
                },
                {
                    component: Delivering,
                    props : {
                        ...props
                    },
                    sort_order: 20,
                    id: "shipment-status-delivering"
                },
                {
                    component: Delivered,
                    props : {
                        ...props
                    },
                    sort_order: 30,
                    id: "shipment-status-delivered"
                }
            ]}
        />;
    else
        return <Area
            id="shipment_status"
            noOuter={true}
            coreWidgets={[
                {
                    component: Pending,
                    props : {
                        ...props
                    },
                    sort_order: 10,
                    id: "shipment-status-pending"
                },
                {
                    component: Delivering,
                    props : {
                        ...props
                    },
                    sort_order: 20,
                    id: "shipment-status-delivering"
                },
                {
                    component: Delivered,
                    props : {
                        ...props
                    },
                    sort_order: 30,
                    id: "shipment-status-delivered"
                }
            ]}
        />;
}

export {ShipmentStatus}