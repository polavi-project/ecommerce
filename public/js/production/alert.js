import { REMOVE_ALERT } from "./event-types.js";

function Alert({ alert }) {
    const dispatch = ReactRedux.useDispatch();
    const [className, setClassName] = React.useState("fadeInDownBig");

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setClassName("fadeOutUp");
        }, 10000);
        return () => clearTimeout(timer);
    }, []);

    const remove = e => {
        e.preventDefault();
        dispatch({ 'type': REMOVE_ALERT, 'payload': { key: alert.key } });
    };

    const close = e => {
        e.preventDefault();
        setClassName("fadeOutUp");
    };

    return React.createElement(
        React.Fragment,
        null,
        alert.type == "error" && React.createElement(
            "div",
            { onAnimationEnd: e => {
                    if (className == "fadeOutUp") remove(e);
                }, className: className + " " + "alert alert-danger animated fast sml-flex-space-between", role: "alert" },
            React.createElement(
                "span",
                null,
                alert.message
            ),
            React.createElement(
                "a",
                { href: "#", onClick: e => close(e, alert) },
                "x"
            )
        ),
        alert.type == "warning" && React.createElement(
            "div",
            { onAnimationEnd: e => {
                    if (className == "fadeOutUp") remove(e);
                }, className: className + " " + "alert alert-warning animated fast sml-flex-space-between", role: "alert" },
            React.createElement(
                "span",
                null,
                alert.message
            ),
            React.createElement(
                "a",
                { href: "#", onClick: e => close(e, alert) },
                "x"
            )
        ),
        alert.type == "success" && React.createElement(
            "div",
            { onAnimationEnd: e => {
                    if (className == "fadeOutUp") remove(e);
                }, className: className + " " + "alert alert-success animated fast sml-flex-space-between", role: "alert" },
            React.createElement(
                "span",
                null,
                alert.message
            ),
            React.createElement(
                "a",
                { href: "#", onClick: e => close(e, alert) },
                "x"
            )
        ),
        alert.type != "error" && alert.type != "success" && alert.type != "warning" && React.createElement(
            "div",
            { onAnimationEnd: e => {
                    if (className == "fadeOutUp") remove(e);
                }, className: className + " " + "alert alert-primary fast animated sml-flex-space-between", role: "alert" },
            React.createElement(
                "span",
                null,
                alert.message
            ),
            React.createElement(
                "a",
                { href: "#", onClick: e => close(e, alert) },
                "x"
            )
        )
    );
}

export default function Alerts() {
    const alerts = ReactRedux.useSelector(state => state.alerts);

    return React.createElement(
        "div",
        { className: "notification" },
        alerts.map((alert, index) => {
            return React.createElement(Alert, { alert: alert, key: alert.key });
        })
    );
}