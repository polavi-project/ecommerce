import {Form} from "../../../../../../js/production/form/form.js";
import Area from "../../../../../../js/production/area.js";
import Text from "../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../js/production/form/fields/select.js";

function General(props) {
    return <div className="uk-width-1-2">
        <h3>Store email</h3>
        <Area
            id="sendgrid-setting-general"
            coreWidgets={[
                {
                    'component': Text,
                    'props': {
                        name: 'sendgrid_sender_name',
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
                        value: _.get(props, 'sendgrid_sender_email', ''),
                        label: 'Store Email',
                        comment: 'This email will be used as a sender email in all transaction email.'
                    },
                    'sort_order': 20,
                    'id': 'sendgrid_sender_email'
                },
                {
                    'component': Select,
                    'props': {
                        name: 'sendgrid_status',
                        value: _.get(props, 'sendgrid_status', ''),
                        label: 'Enable Transaction Email?'
                    },
                    'sort_order': 30,
                    'id': 'sendgrid_status'
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
    return <div className="uk-width-1-2">
        <div><h3>SendGrid api key</h3></div>
        <Text
            name={'sendgrid_apiKey'}
            validation_rules={['notEmpty']}
            formId='sendgrid-setting-form'
            label='API key'
            value={api}
            handler={handler}
        />
        <a href={"#"} onClick={(e) => {e.preventDefault();loadTemplate()}} className="uk-button uk-button-small"><span>Load Templates</span></a>
        <div>{error}</div>
    </div>
}

function Customer(props) {
    return <div className='uk-width-1-2'>
        <h2>Customer emails</h2>
        <Area
            id="sendgrid-setting-customer"
            className="uk-width-1-2"
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
    return <div className='uk-width-1-2'>
        <h2>Order emails</h2>
        <Area
            id="sendgrid-setting-order"
            className="uk-width-1-2"
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

    return <div>
        <Form
            id="sendgrid-setting-form"
            action={props.formAction}
        >
            <Area
                id="sendgrid-setting-form-inner"
                className='uk-grid uk-grid-small'
                coreWidgets={[
                    {
                        'component': General,
                        'props': props,
                        'sort_order': 10,
                        'id': 'sendgrid-setting-general'
                    },
                    {
                        'component': Api,
                        'props': {
                            apiKey: _.get(props, 'sendgrid_apiKey', ''),
                            setTemplates: setTemplates
                        },
                        'sort_order': 20,
                        'id': 'sendgrid-setting-api'
                    },
                    {
                        'component': Customer,
                        'props': {
                            templates: templates, ...props
                        },
                        'sort_order': 30,
                        'id': 'sendgrid-setting-customer'
                    },
                    {
                        'component': Order,
                        'props': {
                            templates: templates, ...props
                        },
                        'sort_order': 40,
                        'id': 'sendgrid-setting-order'
                    }
                ]}
            />
        </Form>
    </div>
}