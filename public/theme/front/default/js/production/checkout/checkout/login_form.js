import { Form } from "../../../../../../../js/production/form/form.js";
import Text from "../../../../../../../js/production/form/fields/text.js";
import Password from "../../../../../../../js/production/form/fields/password.js";

export default function LoginForm(props) {
    const [showForm, setShowForm] = React.useState(false);
    const onClick = e => {
        e.preventDefault();
        setShowForm(!showForm);
    };
    return React.createElement(
        "div",
        null,
        React.createElement(
            "p",
            null,
            "You have an account?",
            React.createElement(
                "a",
                { onClick: e => onClick(e) },
                " Click here to login"
            )
        ),
        React.createElement(
            "div",
            { style: { display: showForm ? 'block' : 'none' } },
            React.createElement(
                Form,
                { id: "checkout-login-form", action: window.base_url + "/login", method: "POST" },
                React.createElement(Text, {
                    formId: "checkout-login-form",
                    name: "email",
                    validation_rules: ['notEmpty', 'email'],
                    label: "Email"
                }),
                React.createElement(Password, {
                    formId: "checkout-login-form",
                    name: "password",
                    validation_rules: ['notEmpty'],
                    label: "Password"
                }),
                React.createElement(
                    "button",
                    { type: "button", className: "uk-button uk-button-primary" },
                    "Login"
                )
            )
        )
    );
}