import { Form } from "../../../../../../../js/production/form/form.js";
import Text from "../../../../../../../js/production/form/fields/text.js";
import Password from "../../../../../../../js/production/form/fields/password.js";

function LoggedInCustomer() {
    const fullName = ReactRedux.useSelector(state => _.get(state, 'appState.customer.full_name'));
    const email = ReactRedux.useSelector(state => _.get(state, 'appState.customer.email'));

    return React.createElement(
        "div",
        { className: "checkout-contact-info" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "strong",
                null,
                "Contact information"
            )
        ),
        React.createElement(
            "div",
            null,
            React.createElement(
                "span",
                null,
                "Full name:"
            ),
            " ",
            React.createElement(
                "span",
                null,
                fullName
            )
        ),
        React.createElement(
            "div",
            null,
            React.createElement(
                "span",
                null,
                "Email:"
            ),
            " ",
            React.createElement(
                "span",
                null,
                email
            )
        )
    );
}

function Guest({ loginUrl, setContactUrl }) {
    const [wantLogin, setWantLogin] = React.useState(false);
    const [wantEdit, setWantEdit] = React.useState(false);
    const [formButton, setFormButton] = React.useState('Submit');
    const [formAction, setFormAction] = React.useState(setContactUrl);
    const fullName = ReactRedux.useSelector(state => _.get(state, 'appState.cart.fullName'));
    const email = ReactRedux.useSelector(state => _.get(state, 'appState.cart.email'));
    const onClickWantLogin = e => {
        e.preventDefault();
        setFormAction(wantLogin === true ? setContactUrl : loginUrl);
        setWantLogin(!wantLogin);
        setFormButton('Login');
    };

    const onClickWantEdit = e => {
        e.preventDefault();
        setWantEdit(true);
    };

    return React.createElement(
        "div",
        { className: "uk-width-1-1" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "strong",
                null,
                "Contact information"
            ),
            " ",
            React.createElement(
                "a",
                { href: "#", onClick: e => onClickWantLogin(e) },
                "Login?"
            )
        ),
        email && fullName && React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                null,
                React.createElement(
                    "span",
                    null,
                    "Full name:"
                ),
                " ",
                React.createElement(
                    "span",
                    null,
                    fullName
                )
            ),
            React.createElement(
                "div",
                null,
                React.createElement(
                    "span",
                    null,
                    "Email:"
                ),
                " ",
                React.createElement(
                    "span",
                    null,
                    email
                )
            ),
            React.createElement(
                "a",
                { href: "#", onClick: e => onClickWantEdit(e) },
                "Edit"
            )
        ),
        (!email || !fullName || wantEdit === true || wantLogin === true) && React.createElement(
            "div",
            null,
            React.createElement(
                Form,
                {
                    id: "checkout-contact-form",
                    action: formAction,
                    method: "POST",
                    submitText: formButton,
                    onComplete: wantEdit === true ? () => setWantEdit(false) : undefined
                },
                wantLogin !== true && React.createElement(Text, {
                    formId: "checkout-contact-form",
                    name: "full_name",
                    validation_rules: ['notEmpty'],
                    label: "Full name",
                    value: fullName
                }),
                React.createElement(Text, {
                    formId: "checkout-contact-form",
                    name: "email",
                    validation_rules: ['notEmpty', 'email'],
                    label: "Email",
                    value: email
                }),
                wantLogin === true && React.createElement(Password, {
                    formId: "checkout-contact-form",
                    name: "password",
                    validation_rules: ['notEmpty'],
                    label: "Password"
                })
            )
        )
    );
}
export default function ContactInformationForm({ loginUrl, setContactUrl }) {
    const email = ReactRedux.useSelector(state => _.get(state, 'appState.customer.email', null));
    return React.createElement(
        "div",
        { className: "uk-width-1-1 checkout-contact" },
        email === null && React.createElement(Guest, { loginUrl: loginUrl, setContactUrl: setContactUrl }),
        email !== null && React.createElement(LoggedInCustomer, null)
    );
}