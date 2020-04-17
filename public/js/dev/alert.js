import {REMOVE_ALERT} from "../production/event-types.js";

function Alert({alert}) {
    const dispatch = ReactRedux.useDispatch();

    React.useEffect(() => {
        const timer = setTimeout(() => {
            dispatch({'type' : REMOVE_ALERT, 'payload': {alerts: [alert]}});
        }, 10000);
        return () => clearTimeout(timer);
    }, []);

    const close = (e, alert) => {
        e.preventDefault();
        dispatch({'type' : REMOVE_ALERT, 'payload': {alerts: [alert]}});
    };

    return <React.Fragment>
        { alert.type == "error" && <div className="alert alert-danger animated fadeInDownBig slow sml-flex-space-between" role="alert">
            <span>{alert.message}</span>
            <a href="#" onClick={(e)=> close(e, alert)}>x</a>
        </div>}
        { alert.type == "warning" && <div className="alert alert-warning animated fadeInDownBig slow sml-flex-space-between" role="alert">
            <span>{alert.message}</span>
            <a href="#" onClick={(e)=> close(e, alert)}>x</a>
        </div>}
        { alert.type == "success" && <div className="alert alert-success animated fadeInDownBig slow sml-flex-space-between" role="alert">
            <span>{alert.message}</span>
            <a href="#" onClick={(e)=> close(e, alert)}>x</a>
        </div>}
        { (alert.type != "error" && alert.type != "success" && alert.type != "warning") && <div className="alert alert-primary slow animated fadeInDownBig sml-flex-space-between" role="alert">
            <span>{alert.message}</span>
            <a href="#" onClick={(e)=> close(e, alert)}>x</a>
        </div>}
    </React.Fragment>
}
export default function Alerts() {
    const alerts = ReactRedux.useSelector(state => state.alerts);

    return <div className="notification">
        {alerts.map((alert, index) => {
            return <Alert alert={alert} key={index}/>
        })}
    </div>;
}