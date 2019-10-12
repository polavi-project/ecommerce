var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Form } from "../../../../../../js/production/form/form.js";
import Area from "../../../../../../js/production/area.js";
import A from "../../../../../../js/production/a.js";
import Text from "../../../../../../js/production/form/fields/text.js";
import Password from "../../../../../../js/production/form/fields/password.js";

function Heading() {
    return React.createElement(
        "h1",
        null,
        "Login"
    );
}

export default function LoginForm(props) {
    return React.createElement(
        Form,
        _extends({ id: "customer-login-form" }, props),
        React.createElement(Area, {
            id: "customer-login-form-inner",
            coreWidgets: [{
                'component': Heading,
                'props': {},
                'sort_order': 10,
                'id': 'heading'
            }, {
                'component': Text,
                'props': {
                    name: "email",
                    value: "",
                    formId: "customer-login-form",
                    label: "Email",
                    validation_rules: ['notEmpty', 'email']
                },
                'sort_order': 20,
                'id': 'email'
            }, {
                'component': Password,
                'props': {
                    name: "password",
                    value: "",
                    formId: "customer-login-form",
                    label: "Password",
                    validation_rules: ['notEmpty']
                },
                'sort_order': 30,
                'id': 'password'
            }, {
                'component': A,
                'props': {
                    url: props.registerUrl,
                    text: "Register for an account"
                },
                'sort_order': 40,
                'id': 'register-link'
            }]
        })
    );
}