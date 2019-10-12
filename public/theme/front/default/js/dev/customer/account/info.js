import {Form} from "../../../../../../../js/production/form/form.js";
import Area from "../../../../../../../js/production/area.js";
import Text from "../../../../../../../js/production/form/fields/text.js";
import Password from "../../../../../../../js/production/form/fields/password.js";
import {REQUEST_END} from "../../../../../../../js/production/event-types.js";
import {ReducerRegistry} from "../../../../../../../js/production/reducer_registry.js";

const mapStateToProps = (state, ownProps) => {
    return state.customerInfo.email ? state.customerInfo : ownProps;
};

function infoReducer(info = {}, action = {}) {
    if(
        action.type === REQUEST_END &&
        action.updateCustomer
    ) {
        return action.updateCustomer.customer;
    }
    return info;
}

ReducerRegistry.register('customerInfo', infoReducer);

function EditForm(props) {
    return <Form id={"customer-info-form"} {...props}>
        <Area
            id={"customer-info-form-inner"}
            coreWidgets={[
                {
                    'component': Text,
                    'props': {
                        name: "full_name",
                        value: props.full_name,
                        formId: "customer-info-form",
                        label: "First name",
                        validation_rules: ['notEmpty']
                    },
                    'sort_order': 10,
                    'id': 'full_name'
                },
                {
                    'component': Text,
                    'props': {
                        name: "email",
                        value: props.email,
                        formId: "customer-info-form",
                        label: "Email",
                        validation_rules: ['notEmpty', 'email']
                    },
                    'sort_order': 30,
                    'id': 'email'
                },
                {
                    'component': Password,
                    'props': {
                        name: "password",
                        value: "",
                        formId: "customer-info-form",
                        label: "New password",
                        validation_rules: []
                    },
                    'sort_order': 40,
                    'id': 'password'
                }
            ]}
        />
    </Form>
}

function Info(props) {
    const [editing, setEditing] = React.useState(false);

    const [token, setToken] = React.useState(function() {
        return PubSub.subscribe(REQUEST_END, function(message, data) {
            if(data.updateCustomer)
                setEditing(false);
        });
    });

    React.useEffect(()=> {
        return function cleanup() {
            PubSub.unsubscribe(token);
        };
    }, []);

    return <div className="uk-grid-small uk-width-1-2@m">
        <h2>Customer information</h2>
        <div><span>Full name</span> : {props.full_name}</div>
        <div><span>Email</span> : {props.email}</div>
        { !editing && <div><a href="#" onClick={(e) => { e.preventDefault(); setEditing(true);}}>Edit</a></div>}
        { editing && <div>
            <EditForm {...props}/>
            <a href={"#"} onClick={(e) => { e.preventDefault(); setEditing(false);}}>Cancel</a>
        </div>}
    </div>
}

export default ReactRedux.connect(mapStateToProps)(Info);