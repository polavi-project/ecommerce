import { Fetch } from "../../../../../../../js/production/fetch.js";

export default function SaleStatistic() {
    const [data, setData] = React.useState([]);
    const [period, setPeriod] = React.useState('daily');
    const api = ReactRedux.useSelector(state => _.get(state, 'appState.graphqlApi'));

    React.useEffect(() => {
        let formData = new FormData();
        formData.append('query', `{saleStatistic (period : ${period}) {time count value}}`);

        Fetch(api, false, 'POST', formData, null, response => {
            if (_.get(response, 'payload.data.saleStatistic')) {
                setData(_.get(response, 'payload.data.saleStatistic'));
            }
        });
    }, [period]);
    return React.createElement(
        'div',
        { className: 'sale-statistic sml-block' },
        React.createElement(
            'div',
            { className: 'sale-statistic-header sml-block-title sml-flex-space-between' },
            React.createElement(
                'div',
                null,
                'Sale statistic'
            ),
            React.createElement(
                'ul',
                { className: 'list-unstyled sml-flex-space-between' },
                React.createElement(
                    'li',
                    { className: 'pl-3' },
                    React.createElement(
                        'a',
                        { onClick: () => setPeriod('daily'), className: period === 'daily' ? "btn btn-dark" : "btn btn-primary" },
                        ' Daily'
                    )
                ),
                React.createElement(
                    'li',
                    { className: 'pl-3' },
                    React.createElement(
                        'a',
                        { onClick: () => setPeriod('weekly'), className: period === 'weekly' ? "btn btn-dark" : "btn btn-primary" },
                        ' Weekly'
                    )
                ),
                React.createElement(
                    'li',
                    { className: 'pl-3' },
                    React.createElement(
                        'a',
                        { onClick: () => setPeriod('monthly'), className: period === 'monthly' ? "btn btn-dark" : "btn btn-primary" },
                        ' Monthly'
                    )
                )
            )
        ),
        React.createElement(
            Recharts.BarChart,
            {
                width: 660,
                height: 300,
                data: data,
                margin: {
                    top: 5, right: 0, left: -25, bottom: 5
                }
            },
            React.createElement(Recharts.CartesianGrid, { strokeDasharray: '3 3' }),
            React.createElement(Recharts.XAxis, { dataKey: 'time' }),
            React.createElement(Recharts.YAxis, null),
            React.createElement(Recharts.Tooltip, null),
            React.createElement(Recharts.Legend, null),
            React.createElement(Recharts.Bar, { type: 'monotone', dataKey: 'value', fill: '#8884d8' }),
            React.createElement(Recharts.Bar, { type: 'monotone', dataKey: 'count', fill: '#82ca9d' })
        )
    );
}