import Area from "../../../../../../../js/production/area.js";

export default function OrderInfo(props) {
    let date = new Date(props.created_at);
    return React.createElement(
        "div",
        { className: "order-edit-info" },
        React.createElement(Area, {
            id: "order_edit_general_info",
            className: "sml-block",
            coreWidgets: [{
                component: () => React.createElement(
                    "div",
                    { className: "sml-block-title" },
                    "General info"
                ),
                props: {},
                sort_order: 10,
                id: "title"
            }, {
                component: ({ customer_full_name }) => React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "strong",
                        null,
                        "Customer full name:"
                    ),
                    React.createElement(
                        "span",
                        null,
                        " "
                    ),
                    React.createElement(
                        "span",
                        null,
                        customer_full_name
                    )
                ),
                props: {
                    customer_full_name: props.customer_full_name
                },
                sort_order: 20,
                id: "customer_full_name"
            }, {
                component: ({ customer_email }) => React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "strong",
                        null,
                        "Customer email:"
                    ),
                    React.createElement(
                        "span",
                        null,
                        " "
                    ),
                    React.createElement(
                        "span",
                        null,
                        customer_email
                    )
                ),
                props: {
                    customer_email: props.customer_email
                },
                sort_order: 30,
                id: "customer_email"
            }, {
                component: ({ order_number }) => React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "strong",
                        null,
                        "Order number:"
                    ),
                    React.createElement(
                        "span",
                        null,
                        " "
                    ),
                    React.createElement(
                        "span",
                        null,
                        "#",
                        order_number
                    )
                ),
                props: {
                    order_number: props.order_number
                },
                sort_order: 40,
                id: "order_number"
            }, {
                component: () => React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "strong",
                        null,
                        "Order date:"
                    ),
                    React.createElement(
                        "span",
                        null,
                        " "
                    ),
                    React.createElement(
                        "span",
                        null,
                        date.toDateString()
                    )
                ),
                props: {},
                sort_order: 50,
                id: "order_date"
            }]
        })
    );
}