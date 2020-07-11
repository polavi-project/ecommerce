import {Form} from "../../../../../../../js/production/form/form.js"
import Text from "../../../../../../../js/production/form/fields/text.js"
import Password from "../../../../../../../js/production/form/fields/password.js"
import Area from "../../../../../../../js/production/area.js";

export default function AdminLoginForm(props) {
    return <div className="admin-login-form-container">
        <Area id="admin_login_before" widgets={[]}/>
        <div className="admin-login-inner sml-block">
            <div className="text-left pb-4 login-logo">
                <a href="javascript:void(0)">
                    <img src={props.logoUrl} title="Polavi admin login"/>
                </a>
            </div>
            <Form {...props} className={"admin-login-form"}>
                <Text
                    name="email"
                    formId="admin_login_form"
                    label="Email"
                    validation_rules={['email']}
                />
                <Password
                    name="password"
                    formId="admin_login_form"
                    label="Password"
                    validation_rules={['notEmpty']}
                />
            </Form>
        </div>
        <Area id="admin_login_after" widgets={[]}/>
    </div>
}