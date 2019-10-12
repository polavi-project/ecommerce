class Text extends React.Component {
    constructor(props) {
        super(props);
        let { name, validation_rules, value } = props;
        this.state = { value: !value ? "" : value };
        if (validation_rules) validation_rules.forEach(rule => {
            switch (rule) {
                case 'required':
                    this.props.dispatch({
                        type: "ADD_VALIDATION_RULE",
                        field_name: name,
                        callback: function (value) {
                            if (value === null || value.replace(/\s/g, '') === "") return false;
                            return true;
                        },
                        message: "This is required field"
                    });
                    break;
                case 'email':
                    this.props.dispatch({
                        type: "ADD_VALIDATION_RULE",
                        field_name: name,
                        callback: function (value) {
                            return (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)
                            );
                        },
                        message: "Invalid email"
                    });
                    break;
                case 'number':
                    this.props.dispatch({
                        type: "ADD_VALIDATION_RULE",
                        field_name: name,
                        callback: function (value) {
                            return (/^\d+$/.test(value)
                            );
                        },
                        message: "Invalid number"
                    });
                    break;
                case 'no-whitespace':
                    this.props.dispatch({
                        type: "ADD_VALIDATION_RULE",
                        field_name: name,
                        callback: function (value) {
                            return (/^\S*$/.test(value)
                            );
                        },
                        message: "No whitespace allowed"
                    });
                    break;
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
        if (nextState.value !== this.state.value || nextProps.value !== this.props.value || nextProps.error !== this.props.error) return true;
        return false;
    }

    componentWillUnmount() {
        let { name } = this.props;
        this.props.dispatch({
            type: "REMOVE_VALIDATION_RULE",
            field_name: name
        });
    }

    // componentWillReceiveProps (newProps) {
    //     let {value} = newProps;
    //     if(!newProps.error)
    //         this.setState({
    //             value: value
    //         })
    // }

    render() {
        const { label, name, placeholder, error } = this.props;
        return React.createElement(
            "div",
            { className: "form-element form-element-text" },
            React.createElement(
                "label",
                { htmlFor: name },
                label
            ),
            React.createElement("input", {
                type: "text",
                className: "uk-input uk-form-small",
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
const mapStateToProps = (state, ownProps) => {
    return {
        error: state.form_validation_errors[ownProps.name]
    };
};
let TextComponent = ReactRedux.connect(mapStateToProps)(Text);
export { TextComponent as Text };