import {Form} from "../../../../../../js/production/form/form.js";
import Area from "../../../../../../js/production/area.js";
import Text from "../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../js/production/form/fields/select.js";
import Switch from "../../../../../../js/production/form/fields/switch.js";
import A from "../../../../../../js/production/a.js";

function General(props) {
    return <div className="sml-block mt-4">
        <div className="sml-block-title">Store email</div>
        <Area
            id="sendgrid_setting_general"
            coreWidgets={[
                {
                    'component': Text,
                    'props': {
                        name: 'sendgrid_sender_name',
                        size: 'medium',
                        value: _.get(props, 'sendgrid_sender_name', ''),
                        label: 'Store Email',
                        comment: 'This will be used as a sender name in all transaction email.'
                    },
                    'sort_order': 10,
                    'id': 'sendgrid_store_email'
                },
                {
                    'component': Text,
                    'props': {
                        name: 'sendgrid_sender_email',
                        size: 'medium',
                        value: _.get(props, 'sendgrid_sender_email', ''),
                        label: 'Store Email',
                        comment: 'This email will be used as a sender email in all transaction email.'
                    },
                    'sort_order': 20,
                    'id': 'sendgrid_sender_email'
                },
                {
                    'component': Switch,
                    'props': {
                        name: 'sendgrid_status',
                        size: 'medium',
                        value: _.get(props, 'sendgrid_status', ''),
                        label: 'Enable Transaction Email?'
                    },
                    'sort_order': 30,
                    'id': 'sendgrid_status'
                },
                {
                    'component': Switch,
                    'props': {
                        name: 'sendgrid_log',
                        size: 'medium',
                        value: _.get(props, 'sendgrid_log', ''),
                        label: 'Enable log?'
                    },
                    'sort_order': 40,
                    'id': 'sendgrid_log'
                }
            ]}
        />
    </div>
}

function Api({apiKey = '', setTemplates}) {

    const [api, setApi] = React.useState(apiKey);
    const [error, setError] = React.useState();

    React.useEffect(function() {
        loadTemplate()
    }, []);

    //TODO: remove Axios
    const loadTemplate = () => {
        axios({
            method: 'get',
            url: 'https://api.sendgrid.com/v3/templates?generations=legacy%2Cdynamic&page_size=200',
            headers: {'Authorization': 'Bearer ' + api },
        }).then(function (response) {
            if(response.status === 400)
                setError(_.get(response, 'data.errors.0.message'));
            else {
                setTemplates(_.get(response, 'data.result', []).map((e) => {
                    return {
                        value: e.id,
                        text: e.name
                    };
                }));
                setError('');
            }
        }).catch(function (error) {
            setError(error.message);
        }).finally(function() {
            // e.target.value = null;
            // setUploading(false);
        });
    };

    const handler = (e) => {
        setApi(e.target.value);
    };
    return <div className="sml-block">
        <div className="sml-block-title">SendGrid api key</div>
        <Text
            name={'sendgrid_apiKey'}
            validation_rules={['notEmpty']}
            formId='sendgrid-setting-form'
            label='API key'
            value={api}
            handler={handler}
        />
        <a href={"#"} onClick={(e) => {e.preventDefault();loadTemplate()}} className="btn btn-primary"><span>Load Templates</span></a>
        <div>{error}</div>
    </div>
}

function Customer(props) {
    return <div className="sml-block">
        <div className="sml-block-title">Customer emails</div>
        <Area
            id="sendgrid_setting_customer"
            className="col-6"
            coreWidgets={[
                {
                    'component': Select,
                    'props': {
                        name: 'sendgrid_customer_welcome_email',
                        value: _.get(props, 'sendgrid_customer_welcome_email', ''),
                        options: _.get(props, 'templates', []),
                        label: 'Customer welcome email template'
                    },
                    'sort_order': 10,
                    'id': 'send_grid_customer_welcome_email'
                }
            ]}
        />
    </div>
}

function Order(props) {
    return <div className="sml-block mt-4">
        <div className="sml-block-title">Order emails</div>
        <Area
            id="sendgrid-setting-order"
            className="col-6"
            coreWidgets={[
                {
                    'component': Select,
                    'props': {
                        name: 'sendgrid_order_confirmation_email',
                        value: _.get(props, 'sendgrid_order_confirmation_email', ''),
                        options: _.get(props, 'templates', []),
                        label: 'Order confirmation email'
                    },
                    'sort_order': 10,
                    'id': 'sendgrid_order_confirmation_email'
                },
                {
                    'component': Select,
                    'props': {
                        name: 'sendgrid_order_complete_email',
                        value: _.get(props, 'sendgrid_order_complete_email', ''),
                        options: _.get(props, 'templates', []),
                        label: 'Order completion email'
                    },
                    'sort_order': 20,
                    'id': 'sendgrid_order_complete_email'
                }
            ]}
        />
    </div>
}

export default function SendGridSetting(props) {
    const [templates, setTemplates] = React.useState([]);

    return <Form
        id="sendgrid-setting-form"
        action={props.formAction}
        submitText={null}
    >
        <div className="form-head sticky">
            <div className="child-align-middle">
                <A url={props.dashboardUrl} className="">
                    <i className="fas fa-arrow-left"></i>
                    <span className="pl-1">Dashboard</span>
                </A>
            </div>
            <div className="buttons">
                <A className="btn btn-danger" url={props.cancelUrl}>Cancel</A>
                <button type="submit" className="btn btn-primary">Submit</button>
            </div>
        </div>
        <div className="row">
            <Area
                id="sendgrid_setting_form_left"
                className='col-4'
                coreWidgets={[
                    {
                        'component': Api,
                        'props': {
                            apiKey: _.get(props, 'sendgrid_apiKey', ''),
                            setTemplates: setTemplates
                        },
                        'sort_order': 10,
                        'id': 'sendgrid-setting-api'
                    },
                    {
                        'component': General,
                        'props': props,
                        'sort_order': 20,
                        'id': 'sendgrid-setting-general'
                    }
                ]}
            />
            <Area
                id="sendgrid_setting_form_right"
                className='col-8'
                coreWidgets={[
                    {
                        'component': Customer,
                        'props': {
                            templates: templates, ...props
                        },
                        'sort_order': 10,
                        'id': 'sendgrid-setting-customer'
                    },
                    {
                        'component': Order,
                        'props': {
                            templates: templates, ...props
                        },
                        'sort_order': 20,
                        'id': 'sendgrid-setting-order'
                    }
                ]}
            />
        </div>
    </Form>
}