import Area from "../../../../../../../js/production/area.js";

function Pending({status, isDropdown}) {
    if(isDropdown === true)
        return <option value='pending'>Pending</option>;
    else if(status == 'pending')
        return <span className="uk-label uk-label-warning"><span uk-icon="icon: tag; ratio: 0.8"></span> Pending</span>;
    else
        return null;
}

function Paid({status, isDropdown}) {
    if(isDropdown === true)
        return <option value='paid'>Paid</option>;
    else if(status == 'paid')
        return <span className="uk-label uk-label-success"><span uk-icon="icon: tag; ratio: 0.8"></span> Paid</span>;
    else
        return null;
}

function Refunded({status, isDropdown}) {
    if(isDropdown === true)
        return <option value='refunded'>Refunded</option>;
    else if(status == 'refunded')
        return <span className="uk-label uk-label-danger"><span uk-icon="icon: tag; ratio: 0.8"></span> Refunded</span>;
    else
        return null;
}

function PaymentStatus({status, isDropdown = false, wrapperProps = {}}) {
    if(isDropdown === false)
        return <Area
            id="payment-status"
            status={status}
            coreWidgets={[
                {
                    component: Pending,
                    props : {
                        status,
                        isDropdown
                    },
                    sort_order: 10,
                    id: "payment-status-pending"
                },
                {
                    component: Paid,
                    props : {
                        status,
                        isDropdown
                    },
                    sort_order: 20,
                    id: "payment-status-paid"
                },
                {
                    component: Refunded,
                    props : {
                        status,
                        isDropdown
                    },
                    sort_order: 30,
                    id: "payment-status-refunded"
                }
            ]}
        />;
    else
        return <Area
            id="payment-status"
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
                    id: "payment-status-pending"
                },
                {
                    component: Paid,
                    props : {
                        status,
                        isDropdown
                    },
                    sort_order: 20,
                    id: "payment-status-paid"
                },
                {
                    component: Refunded,
                    props : {
                        status,
                        isDropdown
                    },
                    sort_order: 30,
                    id: "payment-status-refunded"
                }
            ]}
        />;
}

export {PaymentStatus}