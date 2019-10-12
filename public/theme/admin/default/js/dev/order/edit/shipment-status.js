import Area from "../../../../../../../js/production/area.js";

function Pending({status}) {
    if(status == 'pending')
        return <span className="uk-label uk-label-warning"><span uk-icon="icon: tag; ratio: 0.8"></span> Pending</span>;
    else
        return null;
}

function Delivering({status}) {
    if(status == 'delivering')
        return <span className="uk-label uk-label-warning"><span uk-icon="icon: tag; ratio: 0.8"></span> Delivering</span>;
    else
        return null;
}

function Delivered({status}) {
    if(status == 'delivered')
        return <span className="uk-label uk-label-success"><span uk-icon="icon: tag; ratio: 0.8"></span> Delivered</span>;
    else
        return null;
}

function ShipmentStatus({status}) {
    return <Area
        id="shipment-status"
        status={status}
        coreWidgets={[
            {
                component: Pending,
                props : {
                    status
                },
                sort_order: 10,
                id: "shipment-status-pending"
            },
            {
                component: Delivering,
                props : {
                    status
                },
                sort_order: 20,
                id: "shipment-status-delivering"
            },
            {
                component: Delivered,
                props : {
                    status
                },
                sort_order: 30,
                id: "shipment-status-delivered"
            }
        ]}
    />
}

export {ShipmentStatus}