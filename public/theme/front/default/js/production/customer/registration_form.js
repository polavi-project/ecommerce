var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Form } from "../../../../../../js/production/form/form.js";
import Area from "../../../../../../js/production/area.js";
import Text from "../../../../../../js/production/form/fields/text.js";
import Password from "../../../../../../js/production/form/fields/password.js";
import { ADD_ALERT } from "../../../../../../js/production/event-types.js";

function Heading() {
    return React.createElement(
        "h1",
        null,
        "Create account"
    );
}

export default function RegistrationForm(props) {
    const dispatch = ReactRedux.useDispatch();

    const onComplete = response => {
        if (_.get(response, 'customerCreation.status') === true) {
            dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: "customer_register_success", message: 'Account created successfully', type: "success" }] } });
            if (props.redirectUrl) window.location.assign(props.redirectUrl);
        } else dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: "customer_register_error", message: _.get(response, 'customerCreation.message', 'Something wrong, please try again'), type: "error" }] } });
    };
    return React.createElement(
        Form,
        _extends({ id: "customer-register-form", onComplete: onComplete }, props),
        React.createElement(
            "div",
            { className: "row" },
            React.createElement(Area, {
                id: "customer-register-form-inner",
                className: "col-4",
                coreWidgets: [{
                    'component': Heading,
                    'props': {},
                    'sort_order': 10,
                    'id': 'register_form_heading'
                }, {
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
                }, {
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
                }, {
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
                }]
            })
        )
    );
}