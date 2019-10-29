import {Form} from "../../../../../../../js/production/form/form.js"
import {Text, Password} from "../../../../../../../js/production/form/fields.js"
import Area from "../../../../../../../js/production/area.js";

export default function AdminLoginForm(props) {
    return <div className="admin-login-form uk-flex uk-flex-center">
        <Area id="admin_login_before" widgets={[]}/>
        <Form {...props}>
            <Text
                name="email"
                formId="admin_login_form"
                label="Email"
                validation_rules={['notEmpty']}
            />
            <Password
                name="password"
                label="Password"
                validation_rules={['notEmpty']}
            />
        </Form>
        <Area id="admin_login_after" widgets={[]}/>
    </div>
}