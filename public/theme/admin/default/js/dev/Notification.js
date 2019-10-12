const Notification = ({error, warning, success}) => {
    return <div id="notification">
        {success && <div className="alert alert-success" role="alert">{error}</div>}
        {warning && <div className="alert alert-warning" role="alert">{error}</div>}
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
    </div>;
};
const mapStateToProps = (state, ownProps) => {
    if(state.data.notification === undefined)
        return {};
    return {
        error: state.data.notification.error,
        warning: state.data.notification.warning,
        success: state.data.notification.success,
    }
};
export default ReactRedux.connect(mapStateToProps)(Notification);