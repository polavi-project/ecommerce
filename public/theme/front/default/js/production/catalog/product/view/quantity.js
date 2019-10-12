class Quantity extends React.Component {
    constructor(props) {
        super(props);
        this.props.dispatch({
            type: "ADD_VALIDATION_RULE",
            field_name: "qty",
            callback: function (value) {
                if (value === '') return false;
            },
            message: "This is required field"
        });
        this.props.dispatch({
            type: "ADD_VALIDATION_RULE",
            field_name: "qty",
            callback: function (value) {
                const regex = /^\d+$/;
                return regex.test(value);
            },
            message: "Not valid quantity"
        });
    }

    render() {
        return React.createElement(
            "div",
            { className: "qty" },
            React.createElement(
                "label",
                null,
                "Quantity ",
                React.createElement("input", { name: "qty", type: "text", defaultValue: "" })
            ),
            this.props.error !== undefined && React.createElement(
                "div",
                { className: "error" },
                React.createElement(
                    "span",
                    null,
                    this.props.error
                )
            )
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        error: state.form_validation_errors['qty']
    };
};
export default ReactRedux.connect(mapStateToProps)(Quantity);