import Area from "../../../../../../../js/production/area.js";

function Pending({status, isDropdown}) {
    if(isDropdown === true)
        return <option value='pending'>Pending</option>;
    else if(status == 'pending')
        return <span className="uk-label uk-label-warning"><span uk-icon="icon: tag; ratio: 0.8"></span> Pending</span>;
    else
        return null;
}

function Delivering({status, isDropdown}) {
    if(isDropdown === true)
        return <option value='delivering'>Delivering</option>;
    else if(status == 'delivering')
        return <span className="uk-label uk-label-warning"><span uk-icon="icon: tag; ratio: 0.8"></span> Delivering</span>;
    else
        return null;
}

function Delivered({status, isDropdown}) {
    if(isDropdown === true)
        return <option value='delivered'>Delivered</option>;
    else if(status == 'delivered')
        return <span className="uk-label uk-label-success"><span uk-icon="icon: tag; ratio: 0.8"></span> Delivered</span>;
    else
        return null;
}

function ShipmentStatus({status, isDropdown = false, wrapperProps = {}}) {
    if(isDropdown === false)
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
        />;
    else
        return <Area
            id="shipment-status"
            status={status}
            reactcomponent={"select"}
            wrapperProps={wrapperProps}
            coreWidgets={[
                {
                    component: Pending,
                    props : {
                        status,
                        isDropdown
                    },
                    sort_order: 10,
                    id: "shipment-status-pending"
                },
                {
                    component: Delivering,
                    props : {
                        status,
                        isDropdown
                    },
                    sort_order: 20,
                    id: "shipment-status-delivering"
                },
                {
                    component: Delivered,
                    props : {
                        status,
                        isDropdown
                    },
                    sort_order: 30,
                    id: "shipment-status-delivered"
                }
            ]}
        />;
}

export {ShipmentStatus}