class Textarea extends React.Component {
    constructor(props) {
        super(props);
        let { value } = props;
        this.state = { value };
    }

    onChange(e) {
        this.setState({
            value: e.target.value
        });
    }

    componentWillReceiveProps(newProps) {
        let { value } = newProps;
        if (!newProps.error) this.setState({
            value: value
        });
    }

    componentWillUnmount() {
        let { name } = this.props;
        this.props.dispatch({
            type: "REMOVE_VALIDATION_RULE",
            field_name: name
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.value !== this.state.value || nextProps.value !== this.props.value || nextProps.error !== this.props.error) return true;
        return false;
    }

    render() {
        const { label, name, placeholder, error } = this.props;
        return React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
                "label",
                { htmlFor: name },
                label
            ),
            React.createElement("textarea", {
                className: "uk-textarea uk-form-small",
                id: name,
                name: name,
                placeholder: placeholder,
                value: this.state.value,
                onChange: this.onChange.bind(this)
            }),
            error !== undefined && React.createElement(
                "div",
                { className: "error" },
                React.createElement(
                    "span",
                    null,
                    error
                )
            )
        );
    }
}
const mapValidationError = (state, ownProps) => {
    return {
        error: state.form_validation_errors[ownProps.name]
    };
};
export default ReactRedux.connect(mapValidationError)(Textarea);