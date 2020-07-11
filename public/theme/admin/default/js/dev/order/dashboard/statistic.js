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
    return <div className="sale-statistic sml-block">
        <div className="sale-statistic-header sml-block-title sml-flex-space-between">
            <div>Sale statistic</div>
            <ul className="list-unstyled sml-flex-space-between">
                <li className="pl-3"><a onClick={() => setPeriod('daily')} className={period === 'daily' ? "btn btn-dark" : "btn btn-primary"}> Daily</a></li>
                <li className="pl-3"><a onClick={() => setPeriod('weekly')} className={period === 'weekly' ? "btn btn-dark" : "btn btn-primary"}> Weekly</a></li>
                <li className="pl-3"><a onClick={() => setPeriod('monthly')} className={period === 'monthly' ? "btn btn-dark" : "btn btn-primary"}> Monthly</a></li>
            </ul>
        </div>
        <Recharts.BarChart
            width={660}
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
            <Recharts.Bar type="monotone" dataKey="value" fill="#8884d8"/>
            <Recharts.Bar type="monotone" dataKey="count" fill="#82ca9d"/>
        </Recharts.BarChart>
    </div>;
}