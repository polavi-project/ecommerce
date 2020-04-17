import { REMOVE_ALERT } from "../production/event-types.js";

function Alert({ alert }) {
    const dispatch = ReactRedux.useDispatch();

    React.useEffect(() => {
        const timer = setTimeout(() => {
            dispatch({ 'type': REMOVE_ALERT, 'payload': { alerts: [alert] } });
        }, 10000);
        return () => clearTimeout(timer);
    }, []);

    const close = (e, alert) => {
        e.preventDefault();
        dispatch({ 'type': REMOVE_ALERT, 'payload': { alerts: [alert] } });
    };

    return React.createElement(
        React.Fragment,
        null,
        alert.type == "error" && React.createElement(
            'div',
            { className: 'alert alert-danger animated fadeInDownBig slow sml-flex-space-between', role: 'alert' },
            React.createElement(
                'span',
                null,
                alert.message
            ),
            React.createElement(
                'a',
                { href: '#', onClick: e => close(e, alert) },
                'x'
            )
        ),
        alert.type == "warning" && React.createElement(
            'div',
            { className: 'alert alert-warning animated fadeInDownBig slow sml-flex-space-between', role: 'alert' },
            React.createElement(
                'span',
                null,
                alert.message
            ),
            React.createElement(
                'a',
                { href: '#', onClick: e => close(e, alert) },
                'x'
            )
        ),
        alert.type == "success" && React.createElement(
            'div',
            { className: 'alert alert-success animated fadeInDownBig slow sml-flex-space-between', role: 'alert' },
            React.createElement(
                'span',
                null,
                alert.message
            ),
            React.createElement(
                'a',
                { href: '#', onClick: e => close(e, alert) },
                'x'
            )
        ),
        alert.type != "error" && alert.type != "success" && alert.type != "warning" && React.createElement(
            'div',
            { className: 'alert alert-primary slow animated fadeInDownBig sml-flex-space-between', role: 'alert' },
            React.createElement(
                'span',
                null,
                alert.message
            ),
            React.createElement(
                'a',
                { href: '#', onClick: e => close(e, alert) },
                'x'
            )
        )
    );
}
export default function Alerts() {
    const alerts = ReactRedux.useSelector(state => state.alerts);

    return React.createElement(
        'div',
        { className: 'notification' },
        alerts.map((alert, index) => {
            return React.createElement(Alert, { alert: alert, key: index });
        })
    );
}