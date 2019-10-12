class Select extends React.Component {
    constructor(props) {
        super(props);
        let { name, validation_rules, value } = props;
        this.state = { value: value ? value : "" };
        if (validation_rules) validation_rules.forEach(rule => {
            switch (rule) {
                case 'required':
                    this.props.dispatch({
                        type: "ADD_VALIDATION_RULE",
                        field_name: name,
                        callback: function (value) {
                            if (!value) return false;
                            if (value.replace(/\s/g, '') === "") return false;
                            return true;
                        },
                        message: "This is required field"
                    });
            }
        });
    }

    onChange(e) {
        this.setState({
            value: e.target.value
        });
        if (this.props.handler) this.props.handler.call(window, e, this.props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.value !== this.state.value || nextProps.value !== this.props.value || nextProps.error !== this.props.error || nextProps.options !== this.props.options) return true;
        return false;
    }

    componentWillUnmount() {
        let { name } = this.props;
        this.props.dispatch({
            type: "REMOVE_VALIDATION_RULE",
            field_name: name
        });
    }

    render() {
        const { label, name, error, options } = this.props;
        return React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
                "label",
                { htmlFor: name },
                label
            ),
            React.createElement(
                "select",
                {
                    className: "uk-select uk-form-small",
                    id: name,
                    name: name,
                    value: this.state.value,
                    onChange: this.onChange.bind(this)
                },
                React.createElement(
                    "option",
                    { value: "" },
                    "Please selelct"
                ),
                options.map((option, key) => {
                    return React.createElement(
                        "option",
                        { key: key, value: option.value },
                        option.text
                    );
                })
            ),
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
const mapStateToProps = (state, ownProps) => {
    return {
        error: state.form_validation_errors[ownProps.name]
    };
};
export default ReactRedux.connect(mapStateToProps)(Select);