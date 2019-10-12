var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

class Multiselect extends React.Component {
    constructor(props) {
        super(props);
        let { name, validation_rules, value } = props;
        this.state = { value };
        if (validation_rules) validation_rules.forEach(rule => {
            let action = {
                type: "ADD_VALIDATION_RULE",
                field_name: name
            };
            switch (rule) {
                case 'required':
                    action = _extends({}, action, {
                        callback: function (value) {
                            if (value.replace(/\s/g, '') === "") return false;
                            return true;
                        },
                        message: "This is required field"
                    });
            }
            this.props.dispatch(action);
        });
    }

    onChange(e) {
        let value = [...e.target.options].filter(o => o.selected).map(o => o.value);
        this.setState({ value });
        if (this.props.handler) this.props.handler.call(window, e, this.props);
    }

    componentWillUnmount() {
        let { name } = this.props;
        this.props.dispatch({
            type: "REMOVE_VALIDATION_RULE",
            field_name: name
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.value !== this.state.value || nextProps.value !== this.props.value || nextProps.error !== this.props.error || nextProps.options !== this.props.options) return true;
        return false;
    }

    render() {
        const { label, name, error, options } = this.props;
        console.log(name + options);
        return React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement(
                'label',
                { htmlFor: name },
                label
            ),
            React.createElement(
                'select',
                {
                    className: 'uk-select uk-form-small',
                    id: name,
                    name: name,
                    defaultValue: this.state.value,
                    multiple: 'multiple',
                    onChange: this.onChange.bind(this)
                },
                options.map((option, key) => {
                    return React.createElement(
                        'option',
                        { key: key, value: option.value },
                        option.text
                    );
                })
            ),
            error !== undefined && React.createElement(
                'div',
                { className: 'error' },
                React.createElement(
                    'span',
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
export default ReactRedux.connect(mapStateToProps)(Multiselect);