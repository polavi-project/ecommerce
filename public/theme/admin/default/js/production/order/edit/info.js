import Area from "../../../../../../../js/production/area.js";

export function OrderInfo() {
    let fullName = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.customer_full_name'));
    let email = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.customer_email'));
    let date = new Date(ReactRedux.useSelector(state => _.get(state, 'appState.orderData.created_at')));
    let number = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.order_number'));
    return React.createElement(
        'div',
        { className: "uk-width-1-1 order-edit-info" },
        React.createElement(Area, {
            id: 'order_edit_general_info',
            className: 'border-block',
            coreWidgets: [{
                component: () => React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'h3',
                        null,
                        'General info'
                    )
                ),
                props: {},
                sort_order: 10,
                id: "title"
            }, {
                component: () => React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'strong',
                        null,
                        'Customer full name:'
                    ),
                    React.createElement(
                        'span',
                        null,
                        ' '
                    ),
                    React.createElement(
                        'span',
                        null,
                        fullName
                    )
                ),
                props: {},
                sort_order: 20,
                id: "customer_full_name"
            }, {
                component: () => React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'strong',
                        null,
                        'Customer email:'
                    ),
                    React.createElement(
                        'span',
                        null,
                        ' '
                    ),
                    React.createElement(
                        'span',
                        null,
                        email
                    )
                ),
                props: {},
                sort_order: 30,
                id: "customer_full_email"
            }, {
                component: () => React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'strong',
                        null,
                        'Order number:'
                    ),
                    React.createElement(
                        'span',
                        null,
                        ' '
                    ),
                    React.createElement(
                        'span',
                        null,
                        '#',
                        number
                    )
                ),
                props: {},
                sort_order: 40,
                id: "order_number"
            }, {
                component: () => React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'strong',
                        null,
                        'Order date:'
                    ),
                    React.createElement(
                        'span',
                        null,
                        ' '
                    ),
                    React.createElement(
                        'span',
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