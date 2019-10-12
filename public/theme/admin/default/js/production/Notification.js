const Notification = ({ error, warning, success }) => {
    return React.createElement(
        "div",
        { id: "notification" },
        success && React.createElement(
            "div",
            { className: "alert alert-success", role: "alert" },
            error
        ),
        warning && React.createElement(
            "div",
            { className: "alert alert-warning", role: "alert" },
            error
        ),
        error && React.createElement(
            "div",
            { className: "alert alert-danger", role: "alert" },
            error
        )
    );
};
const mapStateToProps = (state, ownProps) => {
    if (state.data.notification === undefined) return {};
    return {
        error: state.data.notification.error,
        warning: state.data.notification.warning,
        success: state.data.notification.success
    };
};
export default ReactRedux.connect(mapStateToProps)(Notification);