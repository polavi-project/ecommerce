const Message = ({ error, warning, success }) => {
    return React.createElement("div", { id: "notification" }, success && React.createElement("div", { className: "alert alert-success", role: "alert" }, error), warning && React.createElement("div", { className: "alert alert-warning", role: "alert" }, error), error && React.createElement("div", { className: "alert alert-danger", role: "alert" }, error));
};
const mapStateToProps = (state, ownProps) => {
    return {
        error: state.message.error,
        warning: state.message.warning,
        success: state.message.success
    };
};
export default ReactRedux.connect(mapStateToProps)(Message);