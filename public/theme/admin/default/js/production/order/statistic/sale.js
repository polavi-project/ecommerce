import { Fetch } from "../../../../../../../js/production/fetch.js";

function CustomTooltip({ payload, label, active }) {
    if (active) {
        return React.createElement(
            "div",
            { className: "custom-tooltip" },
            React.createElement(
                "p",
                { className: "label" },
                `Count : ${payload[1].value}`
            ),
            React.createElement(
                "p",
                { className: "label" },
                `Amount : ${payload[0].value}`
            )
        );
    }

    return null;
}

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
        "div",
        null,
        React.createElement(
            "div",
            null,
            React.createElement(
                "h3",
                null,
                "Sale statistic"
            )
        ),
        React.createElement(
            Recharts.LineChart,
            {
                width: 1000,
                height: 300,
                data: data,
                margin: {
                    top: 5, right: 0, left: -25, bottom: 5
                }
            },
            React.createElement(Recharts.CartesianGrid, { strokeDasharray: "3 3" }),
            React.createElement(Recharts.XAxis, { dataKey: "time" }),
            React.createElement(Recharts.YAxis, null),
            React.createElement(Recharts.Tooltip, null),
            React.createElement(Recharts.Legend, null),
            React.createElement(Recharts.Line, { type: "monotone", dataKey: "value", stroke: "#8884d8", activeDot: { r: 8 } }),
            React.createElement(Recharts.Line, { type: "monotone", dataKey: "count", stroke: "#82ca9d", activeDot: { r: 8 } })
        )
    );
}