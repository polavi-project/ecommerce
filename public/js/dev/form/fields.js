import {FORM_FIELD_UPDATED, FORM_FIELD_CREATED, FORM_VALIDATED} from "./../event-types.js";

let Error = (props)=> {
    let {error} = props;
    if(!error)
        return "";
    else
        return (<div className="error"><span>{error}</span></div>);
};

class Text extends React.Component {
    constructor(props) {
        super(props);
        let {value} = props;
        this.state = {value: !value ? "" : value, error : null};
    }

    onChange(e) {
        this.setState({
            value: e.target.value
        }, function(state, props, context) {
            PubSub.publishSync(FORM_FIELD_UPDATED, {state, props, context});
        });
        if(this.props.handler)
            this.props.handler.call(this, e, this.props);
    }

    componentDidMount() {
        let _this = this;
        PubSub.publishSync(FORM_FIELD_CREATED, {...this.props});
        PubSub.subscribe(FORM_VALIDATED, function(message, data) {
            if(data.formId === _this.props.formId) {
                _this.setState({
                    ..._this.state,
                    error: data.errors[_this.props.name],
                });
            }
        });
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if(nextState.value !== this.state.value || nextProps.value !== this.props.value || nextProps.error !== this.props.error)
    //         return true;
    //     return false;
    // }

    componentWillUnmount() {
        let {name} = this.props;
    }

    // componentWillReceiveProps (newProps) {
    //     let {value} = newProps;
    //     if(!newProps.error)
    //         this.setState({
    //             value: value
    //         })
    // }

    render () {
        const {label, name, placeholder}  = this.props;
        return <div className="form-element form-element-text">
            <label htmlFor={name}>{label}</label>
            <input
                type="text"
                className="uk-input uk-form-small"
                id={name}
                name={name}
                placeholder={placeholder}
                value={this.state.value}
                onChange={this.onChange.bind(this)}
            />
            <Error error={this.state.error}/>
        </div>
    }
}

class Password extends Text {
    constructor(props) {
        super(props);
    }

    render () {
        const {label, name, placeholder, error}  = this.props;
        return <div className="form-element form-element-text">
            <label htmlFor={name}>{label}</label>
            <input
                type="password"
                className="uk-input uk-form-small"
                id={name}
                name={name}
                placeholder={placeholder}
                value={this.state.value}
                onChange={this.onChange.bind(this)}
            />
            <Error error={error}/>
        </div>
    }
}

class Date extends Text {
    constructor(props) {
        super(props);
    }

    render () {
        const {label, name, placeholder, error}  = this.props;
        return <div className="form-element form-element-text">
            <label htmlFor={name}>{label}</label>
            <input
                type="date"
                className="uk-input uk-form-small"
                id={name}
                name={name}
                placeholder={placeholder}
                value={this.state.value}
                onChange={this.onChange.bind(this)}
            />
            <Error error={error}/>
        </div>
    }
}

class Datetime extends Text {
    constructor(props) {
        super(props);
    }

    render () {
        const {label, name, placeholder, error}  = this.props;
        return <div className="form-element form-element-text">
            <label htmlFor={name}>{label}</label>
            <input
                type="datetime-local"
                className="uk-input uk-form-small"
                id={name}
                name={name}
                placeholder={placeholder}
                value={this.state.value}
                onChange={this.onChange.bind(this)}
            />
            <Error error={error}/>
        </div>
    }
}

const Hidden = ({value, name }) => {
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
        let {value} = props;
        this.state = {value};
    }

    componentDidMount() {
        let {validation_rules} = this.props;
        if(validation_rules)
            this.props.dispatch(
                {
                    type: "ADD_VALIDATION_RULE",
                    rules: validation_rules
                }
            );
    }

    onChange(e) {
        let value = [...e.target.options].filter(o => o.selected).map(o => o.value);
        this.setState({value});
        if(this.props.handler)
            this.props.handler.call(this, e, this.props);
    }

    componentWillUnmount() {
        let {name} = this.props;
        this.props.dispatch(
            {
                type: "REMOVE_VALIDATION_RULE",
                field_name: name
            }
        );
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextState.value !== this.state.value || nextProps.value !== this.props.value || nextProps.error !== this.props.error || nextProps.options !== this.props.options)
            return true;
        return false;
    }

    render () {
        const {label, name, error, options}  = this.props;
        console.log(name + options);
        return <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <select
                className="uk-select uk-form-small"
                id={name}
                name={name}
                defaultValue={this.state.value}
                multiple="multiple"
                onChange={this.onChange.bind(this)}
            >
                {options.map((option, key)=>{
                    return <option key={key} value={option.value}>{option.text}</option>;
                })}
            </select>
            <Error error={error}/>
        </div>
    }
}

class Select extends React.Component {
    constructor(props) {
        super(props);
        let {value} = props;
        this.state = {value: value ? value : ""};
    }
    componentDidMount() {
        let {validation_rules} = this.props;
        if(validation_rules)
            this.props.dispatch(
                {
                    type: "ADD_VALIDATION_RULE",
                    rules: validation_rules
                }
            );
    }

    onChange(e) {
        this.setState({
            value: e.target.value
        });
        if(this.props.handler)
            this.props.handler.call(this, e, this.props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextState.value !== this.state.value || nextProps.value !== this.props.value || nextProps.error !== this.props.error || nextProps.options !== this.props.options)
            return true;
        return false;
    }

    componentWillUnmount() {
        let {name} = this.props;
        this.props.dispatch(
            {
                type: "REMOVE_VALIDATION_RULE",
                field_name: name
            }
        );
    }

    render () {
        const {label, name, error, options}  = this.props;
        return <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <select
                className="uk-select uk-form-small"
                id={name}
                name={name}
                value={this.state.value}
                onChange={this.onChange.bind(this)}
            >
                <option value="">Please selelct</option>
                {options.map((option, key)=>{
                    return <option key={key} value={option.value}>{option.text}</option>;
                })}
            </select>
            <Error error={error}/>
        </div>
    }
}

class Textarea extends React.Component {
    constructor(props) {
        super(props);
        let {value} = props;
        this.state = {value};
    }

    onChange(e) {
        this.setState({
            value: e.target.value
        })
    }

    componentWillReceiveProps (newProps) {
        let {value} = newProps;
        if(!newProps.error)
            this.setState({
                value: value
            })
    }

    componentWillUnmount() {
        let {name} = this.props;
        this.props.dispatch(
            {
                type: "REMOVE_VALIDATION_RULE",
                field_name: name
            }
        );
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextState.value !== this.state.value || nextProps.value !== this.props.value || nextProps.error !== this.props.error)
            return true;
        return false;
    }

    render () {
        const {label, name, placeholder, error}  = this.props;
        return <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <textarea
                className="uk-textarea uk-form-small"
                id={name}
                name={name}
                placeholder={placeholder}
                value={this.state.value}
                onChange={this.onChange.bind(this)}
            />
            <Error error={error}/>
        </div>
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        error: state.form_validation_errors[ownProps.name]
    }
};


export {Text, Textarea, Password, Select, Multiselect, Hidden, Date, Datetime}
