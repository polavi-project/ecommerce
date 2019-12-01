import {Fetch} from "../../../../../../../js/production/fetch.js";

export default function SaleStatistic() {
    const [data, setData] = React.useState([]);
    const [period, setPeriod] = React.useState('daily');
    const api = ReactRedux.useSelector(state => _.get(state, 'appState.graphqlApi'));

    React.useEffect(()=> {
        let formData = new FormData();
        formData.append('query', `{saleStatistic (period : ${period}) {time value}}`);

        Fetch(
            api,
            false,
            'POST',
            formData,
            null,
            (response) => {
                if(_.get(response, 'payload.data.saleStatistic')) {
                    setData(_.get(response, 'payload.data.saleStatistic'));
                }
            }
        );
    }, [period]);
    return <div>
        <div><h3>Sale statistic</h3></div>
        <Recharts.LineChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 5, right: 30, left: 20, bottom: 5,
            }}
        >
            <Recharts.CartesianGrid strokeDasharray="3 3" />
            <Recharts.XAxis dataKey="time" />
            <Recharts.YAxis />
            <Recharts.Tooltip />
            <Recharts.Legend />
            <Recharts.Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
        </Recharts.LineChart>
    </div>;
}