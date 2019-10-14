import Area from "../../../../../../../js/production/area.js";

function Pending({status}) {
    if(status === 'pending')
        return <span className="uk-label uk-label-warning"><span uk-icon="icon: tag; ratio: 0.8"></span> Pending</span>;
    else
        return null;
}

function Processing({status}) {
    if(status === 'processing')
        return <span className="uk-label"><span uk-icon="icon: tag; ratio: 0.8"></span> Processing</span>;
    else
        return null;
}

function Completed({status}) {
    if(status === 'completed')
        return <span className="uk-label uk-label-success"><span uk-icon="icon: tag; ratio: 0.8"></span> Completed</span>;
    else
        return null;
}

function Cancelled({status}) {
    if(status === 'cancelled')
        return <span className="uk-label uk-label-danger"><span uk-icon="icon: tag; ratio: 0.8"></span> Cancelled</span>;
    else
        return null;
}

function Status({status}) {
    return <Area
        id="order_status"
        status={status}
        coreWidgets={[
            {
                component: Pending,
                props : {
                    status
                },
                sort_order: 10,
                id: "order-status-pending"
            },
            {
                component: Processing,
                props : {
                    status
                },
                sort_order: 20,
                id: "order-status-processing"
            },
            {
                component: Completed,
                props : {
                    status
                },
                sort_order: 30,
                id: "order-status-completed"
            },
            {
                component: Cancelled,
                props : {
                    status
                },
                sort_order: 40,
                id: "order-status-cancelled"
            }
        ]}
    />
}

export {Status}