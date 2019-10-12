import {Form} from "../../../../../../js/production/form/form.js";
import Area from "../../../../../../js/production/area.js";
import Text from "../../../../../../js/production/form/fields/text.js";
import Password from "../../../../../../js/production/form/fields/password.js";
import {ADD_ALERT} from "../../../../../../js/production/event-types.js";

function Heading() {
    return <h1>Create account</h1>
}

function Query() {
    return <input type='text' name="query" value="mutation CreateCustomer($customer: CustomerInput!) { createCustomer (customer: $customer) {status message customer {customer_id group_id status full_name email}}}" readOnly style={{display:'none'}}/>
}
export default function RegistrationForm(props) {
    const dispatch = ReactRedux.useDispatch();

    const onComplete = (response) => {
        if(_.get(response, 'payload.data.createCustomer.status') === true) {
            dispatch({'type' : ADD_ALERT, 'payload': {alerts: [{id: "customer_register_success", message: 'Account created successfully', type: "success"}]}});
            if(props.redirectUrl)
                window.location.assign(props.redirectUrl);
        } else
            dispatch({'type' : ADD_ALERT, 'payload': {alerts: [{id: "customer_register_error", message: _.get(response, 'payload.data.createCustomer.message', 'Something wrong, please try again'), type: "error"}]}});
    };
    return <Form id={"customer-register-form"} onComplete={onComplete} {...props}>
        <Area
            id={"customer-register-form-inner"}
            coreWidgets={[
                {
                    'component': Heading,
                    'props': {
                    },
                    'sort_order': 10,
                    'id': 'register_form_heading'
                },
                {
                    'component': Text,
                    'props': {
                        name: "variables[customer][full_name]",
                        value: "",
                        formId: "customer-register-form",
                        label: "Full name",
                        validation_rules: ['notEmpty']
                    },
                    'sort_order': 20,
                    'id': 'full_name'
                },
                {
                    'component': Text,
                    'props': {
                        name: "variables[customer][email]",
                        value: "",
                        formId: "customer-register-form",
                        label: "Email",
                        validation_rules: ['notEmpty', 'email']
                    },
                    'sort_order': 40,
                    'id': 'email'
                },
                {
                    'component': Password,
                    'props': {
                        name: "variables[customer][password]",
                        value: "",
                        formId: "customer-register-form",
                        label: "Password",
                        validation_rules: ['notEmpty']
                    },
                    'sort_order': 50,
                    'id': 'password'
                },
                {
                    'component': Query,
                    'props': {
                    },
                    'sort_order': 60,
                    'id': 'query'
                }
            ]}
        />
    </Form>
}