var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Form } from "../../../../../../../js/production/form/form.js";
import Area from "../../../../../../../js/production/area.js";
import Text from "../../../../../../../js/production/form/fields/text.js";
import Password from "../../../../../../../js/production/form/fields/password.js";

export default function FirstUserForm(props) {
    const [isSuccess, setIsSuccess] = React.useState(true);
    if (props.step !== 'adminUser') return null;
    return React.createElement(
        "div",
        null,
        React.createElement(
            "div",
            null,
            React.createElement(
                "strong",
                null,
                "Admin user information"
            )
        ),
        isSuccess !== true && React.createElement(
            "p",
            { className: "text-danger" },
            isSuccess
        ),
        React.createElement(
            Form,
            _extends({
                id: "admin-user-form",
                submitText: "Let's go",
                onComplete: response => {
                    if (response.success === 1) props.setStep('go');else setIsSuccess(_.get(response, 'message', 'Can not create admin user'));
                }
            }, props),
            React.createElement(
                "div",
                { className: "uk-grid uk-grid-small" },
                React.createElement(Area, {
                    id: "admin_user_form_inner",
                    coreWidgets: [{
                        component: Text,
                        props: {
                            id: "email",
                            formId: "admin-user-form",
                            name: "email",
                            label: "email",
                            value: '',
                            validation_rules: ['notEmpty', 'email']
                        },
                        sort_order: 10,
                        id: "email"
                    }, {
                        component: Password,
                        props: {
                            id: "password",
                            formId: "admin-user-form",
                            name: "password",
                            label: "Password",
                            value: '',
                            validation_rules: ['notEmpty']
                        },
                        sort_order: 20,
                        id: "password"
                    }]
                })
            )
        )
    );
}