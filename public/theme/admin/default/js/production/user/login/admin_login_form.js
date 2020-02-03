import { Form } from "../../../../../../../js/production/form/form.js";
import Text from "../../../../../../../js/production/form/fields/text.js";
import Password from "../../../../../../../js/production/form/fields/password.js";
import Area from "../../../../../../../js/production/area.js";

export default function AdminLoginForm(props) {
    return React.createElement(
        "div",
        { className: "admin-login-form uk-flex uk-flex-center uk-border-pill" },
        React.createElement(Area, { id: "admin_login_before", widgets: [] }),
        React.createElement(
            Form,
            props,
            React.createElement(Text, {
                name: "email",
                formId: "admin_login_form",
                label: "Email",
                validation_rules: ['email']
            }),
            React.createElement(Password, {
                name: "password",
                formId: "admin_login_form",
                label: "Password",
                validation_rules: ['notEmpty']
            })
        ),
        React.createElement(Area, { id: "admin_login_after", widgets: [] })
    );
}