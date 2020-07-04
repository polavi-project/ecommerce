import Area from "../../../../../../../js/production/area.js";

export default function OrderInfo(props) {
    let date = new Date(props.created_at);
    return <div className={"order-edit-info"}>
        <Area
            id="order_edit_general_info"
            className="sml-block"
            coreWidgets={[
                {
                    component: () => <div className="sml-block-title">General info</div>,
                    props : {
                    },
                    sort_order: 10,
                    id: "title"
                },
                {
                    component: ({customer_full_name}) => <div><strong>Customer full name:</strong><span> </span><span>{customer_full_name}</span></div>,
                    props : {
                        customer_full_name: props.customer_full_name
                    },
                    sort_order: 20,
                    id: "customer_full_name"
                },
                {
                    component: ({customer_email}) => <div><strong>Customer email:</strong><span> </span><span>{customer_email}</span></div>,
                    props : {
                        customer_email: props.customer_email
                    },
                    sort_order: 30,
                    id: "customer_email"
                },
                {
                    component: ({order_number}) => <div><strong>Order number:</strong><span> </span><span>#{order_number}</span></div>,
                    props : {
                        order_number: props.order_number
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