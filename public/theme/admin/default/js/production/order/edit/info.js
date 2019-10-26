export function OrderInfo() {
    let date = new Date(ReactRedux.useSelector(state => _.get(state, 'appState.orderData.created_at')));
    let number = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.order_number'));
    return React.createElement(
        'div',
        { className: "uk-width-1-1 order-edit-info" },
        React.createElement(
            'div',
            null,
            React.createElement(
                'strong',
                null,
                '#',
                number
            ),
            ' ',
            React.createElement(
                'i',
                null,
                date.toDateString()
            )
        )
    );
}