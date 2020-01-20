import Area from "../../../../../../../js/production/area.js";

export function OrderInfo() {
    let fullName = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.customer_full_name'));
    let email = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.customer_email'));
    let date = new Date(ReactRedux.useSelector(state => _.get(state, 'appState.orderData.created_at')));
    let number = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.order_number'));
    return <div className={"uk-width-1-1 order-edit-info"}>
        <Area
            id="order_edit_general_info"
            className="border-block"
            coreWidgets={[
                {
                    component: () => <div><h3>General info</h3></div>,
                    props : {
                    },
                    sort_order: 10,
                    id: "title"
                },
                {
                    component: () => <div><strong>Customer full name:</strong><span> </span><span>{fullName}</span></div>,
                    props : {
                    },
                    sort_order: 20,
                    id: "customer_full_name"
                },
                {
                    component: () => <div><strong>Customer email:</strong><span> </span><span>{email}</span></div>,
                    props : {
                    },
                    sort_order: 30,
                    id: "customer_full_email"
                },
                {
                    component: () => <div><strong>Order number:</strong><span> </span><span>#{number}</span></div>,
                    props : {
                    },
                    sort_order: 40,
                    id: "order_number"
                },
                {
                    component: () => <div><strong>Order date:</strong><span> </span><span>{date.toDateString()}</span></div>,
                    props : {
                    },
                    sort_order: 50,
                    id: "order_date"
                }
            ]}
        />
    </div>
}