import {Form} from "../../../../../../../js/production/form/form.js"
import Area from "../../../../../../../js/production/area.js"
import Text from "../../../../../../../js/production/form/fields/text.js";
import Password from "../../../../../../../js/production/form/fields/password.js";

export default function FirstUserForm(props) {
    const [isSuccess, setIsSuccess] = React.useState(true);
    if(props.step !== 'adminUser')
        return null;
    return <div>
        <div><strong>Admin user information</strong></div>
        {isSuccess !== true && <p className="text-danger">{isSuccess}</p>}
        <Form
            id={"admin-user-form"}
            submitText="Let's go"
            onComplete={(response)=> {
                if(response.success === 1)
                    props.setStep('go');
                else
                    setIsSuccess(_.get(response, 'message', 'Can not create admin user'));
            }}
            {...props}>
            <div className="uk-grid uk-grid-small">
                <Area
                    id="admin_user_form_inner"
                    coreWidgets={[
                        {
                            component: Text,
                            props : {
                                id : "email",
                                formId: "admin-user-form",
                                name: "email",
                                label: "email",
                                value: '',
                                validation_rules: ['notEmpty', 'email']
                            },
                            sort_order: 10,
                            id: "email"
                        },
                        {
                            component: Password,
                            props : {
                                id : "password",
                                formId: "admin-user-form",
                                name: "password",
                                label: "Password",
                                value: '',
                                validation_rules: ['notEmpty']
                            },
                            sort_order: 20,
                            id: "password"
                        }
                    ]}
                />
            </div>
        </Form>
    </div>
}