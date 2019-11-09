import {Form} from "../../../../../../../js/production/form/form.js"
import Area from "../../../../../../../js/production/area.js"
import Text from "../../../../../../../js/production/form/fields/text.js";

export default function DatabaseForm(props) {
    const [isSuccess, setIsSuccess] = React.useState(true);
    if(props.step !== 'database')
        return null;
    return <div>
        <div><strong>Database information</strong></div>
        <p>Please provide your database connection information.</p>
        {isSuccess === false && <p className="text-danger">Can not connect to database. Please check again your information.</p>}
        <Form
            id={"database-form"}
            submitText="Next"
            onComplete={(response)=> {
                if(response.success === 1)
                    props.setStep('adminUser');
                else
                    setIsSuccess(false);
            }}
            {...props}
        >
            <div className="uk-grid uk-grid-small">
                <Area
                    id="database_form_inner"
                    coreWidgets={[
                        {
                            component: Text,
                            props : {
                                id : "db_name",
                                formId: "database-form",
                                name: "db_name",
                                label: "Database name",
                                value: '',
                                validation_rules: ['notEmpty']
                            },
                            sort_order: 10,
                            id: "db_name"
                        },
                        {
                            component: Text,
                            props : {
                                id : "db_user",
                                formId: "database-form",
                                name: "db_user",
                                label: "Database user",
                                value: '',
                                validation_rules: ['notEmpty']
                            },
                            sort_order: 20,
                            id: "db_user"
                        },
                        {
                            component: Text,
                            props : {
                                id : "db_password",
                                formId: "database-form",
                                name: "db_password",
                                label: "Database password",
                                value: '',
                                validation_rules: ['notEmpty']
                            },
                            sort_order: 30,
                            id: "db_password"
                        },
                        {
                            component: Text,
                            props : {
                                id : "db_host",
                                formId: "database-form",
                                name: "db_host",
                                label: "Database host",
                                value: 'localhost',
                                validation_rules: ['notEmpty']
                            },
                            sort_order: 30,
                            id: "db_host"
                        }
                    ]}
                />
            </div>
        </Form>
    </div>
}