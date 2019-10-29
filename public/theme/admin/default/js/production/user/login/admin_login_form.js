import { Form } from "../../../../../../../js/production/form/form.js";
import { Text, Password } from "../../../../../../../js/production/form/fields.js";
import Area from "../../../../../../../js/production/area.js";

export default function AdminLoginForm(props) {
    return React.createElement(
        "div",
        { className: "admin-login-form uk-flex uk-flex-center" },
        React.createElement(Area, { id: "admin_login_before", widgets: [] }),
        React.createElement(
            Form,
            props,
            React.createElement(Text, {
                name: "email",
                formId: "admin_login_form",
                label: "Email",
                validation_rules: ['notEmpty']
            }),
            React.createElement(Password, {
                name: "password",
                label: "Password",
                validation_rules: ['notEmpty']
            })
        ),
        React.createElement(Area, { id: "admin_login_after", widgets: [] })
    );
}