import {Form} from "../../../../../../../js/production/form/form.js";
import Text from "../../../../../../../js/production/form/fields/text.js";
import Password from "../../../../../../../js/production/form/fields/password.js";

export default function LoginForm({loginUrl}) {
    const [showForm, setShowForm] = React.useState(false);
    const onClick = (e) => {
        e.preventDefault();
        setShowForm(!showForm);
    };

    return <div>
        <p>
            You have an account?
            <a onClick={(e) => onClick(e)}> Click here to login</a>
        </p>
        <div style={{display: showForm ? 'block' : 'none'}}>
            <Form
                id={"checkout-login-form"}
                action={loginUrl}
                method={"POST"}
                submitText="Login"
            >
                <Text
                    formId={"checkout-login-form"}
                    name={"email"}
                    validation_rules={['notEmpty', 'email']}
                    label={"Email"}
                />
                <Password
                    formId={"checkout-login-form"}
                    name={"password"}
                    validation_rules={['notEmpty']}
                    label={"Password"}
                />
            </Form>
        </div>
    </div>
}