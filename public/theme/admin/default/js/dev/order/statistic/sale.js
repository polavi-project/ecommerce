import {Fetch} from "../../../../../../../js/production/fetch.js";


export default function SaleStatistic() {
    const [data, setData] = React.useState([]);
    const [period, setPeriod] = React.useState('daily');
    const api = ReactRedux.useSelector(state => _.get(state, 'appState.graphqlApi'));

    React.useEffect(()=> {
        let formData = new FormData();
        formData.append('query', `{saleStatistic (period : ${period}) {time count value}}`);

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
    return <div className="sale-statistic">
        <div className="sale-statistic-header uk-flex">
            <h3>Sale statistic</h3>
            <ul>
                <li><label><input onChange={() => setPeriod('daily')} className="uk-radio" type="radio" checked={period === 'daily'}/> Daily</label></li>
                <li><label><input onChange={() => setPeriod('weekly')} className="uk-radio" type="radio" checked={period === 'weekly'}/> Weekly</label></li>
                <li><label><input onChange={() => setPeriod('monthly')} className="uk-radio" type="radio" checked={period === 'monthly'}/> Monthly</label></li>
            </ul>
        </div>
        <Recharts.LineChart
            width={1000}
            height={300}
            data={data}
            margin={{
                top: 5, right: 0, left: -25, bottom: 5,
            }}
        >
            <Recharts.CartesianGrid strokeDasharray="3 3" />
            <Recharts.XAxis dataKey="time" />
            <Recharts.YAxis />
            <Recharts.Tooltip />
            <Recharts.Legend />
            <Recharts.Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Recharts.Line type="monotone" dataKey="count" stroke="#82ca9d" activeDot={{ r: 8 }} />
        </Recharts.LineChart>
    </div>;
}