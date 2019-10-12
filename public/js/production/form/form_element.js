var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

class Text extends React.Component {
    constructor(props) {
        super(props);
        let { name, validation_rules, value } = props;
        this.state = { value: !value ? "" : value };
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

class Password extends React.Component {
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
                            if (value.replace(/\s/g, '') === "") return false;
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

    componentWillUnmount() {
        let { name } = this.props;
        this.props.dispatch({
            type: "REMOVE_VALIDATION_RULE",
            field_name: name
        });
    }

    onChange(e) {
        this.setState({
            value: e.target.value
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.value !== this.state.value || nextProps.value !== this.props.value || nextProps.error !== this.props.error) return true;
        return false;
    }

    componentWillReceiveProps(newProps) {
        let { value } = newProps;
        if (!newProps.error) this.setState({
            value: value
        });
    }

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
                type: "password",
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

class Date extends Text {
    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        let { name } = this.props;
        this.props.dispatch({
            type: "REMOVE_VALIDATION_RULE",
            field_name: name
        });
    }

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
                type: "date",
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

class Datetime extends Text {
    constructor(props) {
        super(props);
    }

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
                type: "datetime-local",
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

const Hidden = ({ value, name }) => {
    return React.createElement("div", { className: "form-group" }, React.createElement("input", {
        type: "hidden",
        className: "form-control",
        id: name,
        name: name,
        defaultValue: value
    }));
};

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
                    defaultValue: this.state.value,
                    multiple: "multiple",
                    onChange: this.onChange.bind(this)
                },
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

export { Text, Textarea, Select, Multiselect, Password, Date, Datetime, Hidden };