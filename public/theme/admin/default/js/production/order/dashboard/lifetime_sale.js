export default function LifetimeSale({ orders, total, completed_percentage, cancelled_percentage }) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency'));
    const _total = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(total);
    const data = [{ name: 'Completed', value: completed_percentage }, { name: 'Cancelled', value: cancelled_percentage }, { name: 'Others', value: 100 - completed_percentage - cancelled_percentage }];
    const COLORS = ['#058C8C', '#dc3545', '#E1E1E1'];

    return React.createElement(
        'div',
        { className: 'sml-block lifetime-sale' },
        React.createElement(
            'table',
            { className: 'table' },
            React.createElement(
                'tbody',
                null,
                React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'td',
                        null,
                        React.createElement(
                            'div',
                            { className: 'title' },
                            React.createElement(
                                'span',
                                { className: 'text-primary' },
                                'Number of orders'
                            )
                        )
                    ),
                    React.createElement(
                        'td',
                        null,
                        React.createElement(
                            'div',
                            { className: 'value text-primary' },
                            React.createElement(
                                'span',
                                null,
                                orders,
                                ' orders'
                            )
                        )
                    )
                ),
                React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'td',
                        null,
                        React.createElement(
                            'div',
                            { className: 'title' },
                            React.createElement(
                                'span',
                                { className: 'text-primary' },
                                'Lifetime sales'
                            )
                        )
                    ),
                    React.createElement(
                        'td',
                        null,
                        React.createElement(
                            'div',
                            { className: 'value text-primary' },
                            React.createElement(
                                'span',
                                null,
                                _total
                            )
                        )
                    )
                ),
                React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'td',
                        null,
                        React.createElement(
                            'span',
                            { className: 'title text-primary' },
                            completed_percentage,
                            '% completed'
                        ),
                        React.createElement(
                            'span',
                            { className: 'title text-danger' },
                            cancelled_percentage,
                            '% cancelled'
                        )
                    ),
                    React.createElement(
                        'td',
                        null,
                        React.createElement(
                            'div',
                            { className: 'value' },
                            React.createElement(
                                Recharts.PieChart,
                                { width: 80, height: 80 },
                                React.createElement(
                                    Recharts.Pie,
                                    {
                                        data: data,
                                        cx: 30,
                                        cy: 30,
                                        labelLine: false,
                                        outerRadius: 35,
                                        fill: '#8884d8',
                                        dataKey: 'value'
                                    },
                                    data.map((entry, index) => React.createElement(Recharts.Cell, { key: `cell-${index}`, fill: COLORS[index % COLORS.length] }))
                                )
                            )
                        )
                    )
                )
            )
        )
    );
}