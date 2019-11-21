export default function Alert() {
    const alerts = ReactRedux.useSelector(state => state.alerts);

    React.useEffect(() => {
        alerts.map((alert, index) => {
            switch (alert.type) {
                case "error":
                    UIkit.notification({ message: alert.message, status: 'danger' });
                    break;
                case "success":
                    UIkit.notification({ message: alert.message, status: 'success' });
                    break;
                default:
                    UIkit.notification({ message: alert.message, status: 'primary' });
            }
        });
    }, [alerts]);

    return null;
}