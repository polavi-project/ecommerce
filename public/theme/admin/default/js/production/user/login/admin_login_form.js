var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Form } from "../../../../../../../js/production/form/form.js";
import Text from "../../../../../../../js/production/form/fields/text.js";
import Password from "../../../../../../../js/production/form/fields/password.js";
import Area from "../../../../../../../js/production/area.js";

export default function AdminLoginForm(props) {
    return React.createElement(
        "div",
        { className: "admin-login-form-container" },
        React.createElement(Area, { id: "admin_login_before", widgets: [] }),
        React.createElement(
            "div",
            { className: "admin-login-inner sml-block" },
            React.createElement(
                "div",
                { className: "text-left pb-4 login-logo" },
                React.createElement(
                    "a",
                    { href: "javascript:void(0)" },
                    React.createElement("img", { src: props.logoUrl, title: "Polavi admin login" })
                )
            ),
            React.createElement(
                Form,
                _extends({}, props, { className: "admin-login-form" }),
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
            )
        ),
        React.createElement(Area, { id: "admin_login_after", widgets: [] })
    );
}