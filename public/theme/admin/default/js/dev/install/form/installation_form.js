import {Form} from "../../../../../../../js/production/form/form.js";
import Text from "../../../../../../../js/production/form/fields/text.js";
import Password from "../../../../../../../js/production/form/fields/password.js";
import {ADD_APP_STATE} from "../../../../../../../js/dev/event-types.js";
import {Fetch} from "../../../../../../../js/production/fetch.js";

function DBInfo() {
    return <div className="uk-width-1-2">
        <div><strong>Database information</strong></div>
        <p>Please provide your database connection information.</p>
        <div>
            <Text
                formId = "installation-form"
                name = "db_name"
                label = "Database name"
                value = ''
                validation_rules = {['notEmpty']}
            />
            <Text
                formId = "installation-form"
                name = "db_user"
                label = "Database user"
                value = ''
                validation_rules = {['notEmpty']}
            />
            <Text
                formId = "installation-form"
                name = "db_password"
                label= "Database password"
                value= ''
            />
            <Text
                formId = "installation-form"
                name = "db_host"
                label= "Database host"
                value= 'localhost'
                validation_rules= {['notEmpty']}
            />
        </div>
    </div>
}

function AdminUser() {
    return <div className="uk-width-1-2">
        <div><strong>Admin user information</strong></div>
        <div>
            <Text
                formId = "installation-form"
                name = "full_name"
                label = "Full name"
                value = ''
                validation_rules= {['notEmpty']}
            />
            <Text
                formId = "installation-form"
                name = "email"
                label = "Email"
                value = ''
                validation_rules= {['notEmpty', 'email']}
            />
            <Password
                formId = "installation-form"
                name = "password"
                label = "Password"
                value = ''
                validation_rules= {['notEmpty']}
            />
        </div>
    </div>
}

function Welcome() {
    const admin = ReactRedux.useSelector(state => _.get(state, 'appState.baseUrlAdmin'));
    const front = ReactRedux.useSelector(state => _.get(state, 'appState.baseUrl'));
    return <div>
        <h2>Great. Let's start using Similik</h2>
        <div className="uk-text-center">
            <p><a href={admin} className="uk-button uk-button-primary uk-button-small" target='_blank'>Admin</a></p>
            <a href={front} className="uk-button uk-button-primary uk-button-small" target='_blank'>Front site</a>
        </div>
    </div>
}
export default function Installation({action}) {
    const letsGo = ReactRedux.useSelector(state => _.get(state, 'appState.letsGo'));
    const dispatch = ReactRedux.useDispatch();
    const [ready, setReady] = React.useState(false);
    const [stack, setStack] = React.useState(
        [
            {
                step: 'Basic setting',
                api: ReactRedux.useSelector(state => _.get(state, 'appState.baseUrlAdmin') + '/setting/migrate/install'),
                running: false,
                status: undefined,
                message: 'Waiting',
            },
            {
                step: 'Cms module',
                api: ReactRedux.useSelector(state => _.get(state, 'appState.baseUrlAdmin') + '/cms/migrate/install'),
                status: undefined,
                message: 'Waiting'
            },
            {
                step: 'Customer module',
                api: ReactRedux.useSelector(state => _.get(state, 'appState.baseUrlAdmin') + '/customer/migrate/install'),
                status: undefined,
                message: 'Waiting'
            },
            {
                step: 'Tax module',
                api: ReactRedux.useSelector(state => _.get(state, 'appState.baseUrlAdmin') + '/tax/migrate/install'),
                status: undefined,
                message: 'Waiting'
            },
            {
                step: 'Catalog setting',
                api: ReactRedux.useSelector(state => _.get(state, 'appState.baseUrlAdmin') + '/catalog/migrate/install'),
                status: undefined,
                message: 'Waiting'
            },
            {
                step: 'Checkout setting',
                api: ReactRedux.useSelector(state => _.get(state, 'appState.baseUrlAdmin') + '/checkout/migrate/install'),
                status: undefined,
                message: 'Waiting'
            },
            {
                step: 'Discount setting',
                api: ReactRedux.useSelector(state => _.get(state, 'appState.baseUrlAdmin') + '/discount/migrate/install'),
                status: undefined,
                message: 'Waiting'
            },
            {
                step: 'Finishing',
                api: ReactRedux.useSelector(state => _.get(state, 'appState.baseUrlAdmin') + '/install/finish'),
                status: undefined,
                message: 'Waiting'
            }
        ]
    );

    React.useEffect(()=>{
        if(letsGo !== true)
            return;
        for (let i = 0; i < stack.length; ++i) {
            let item = stack[i];
            if(item.message === 'Running')
                break;
            if(item.status === false)
                break;
            if(item.status === undefined) {
                Fetch(item.api, false, 'POST', {}, ()=> {
                    setStack(stack.map((s)=> {
                        if(s.step === item.step)
                            s.message = 'Running';

                        return s;
                    }));
                }, (response) => {
                    if(parseInt(response.success) === 1)
                        setStack(stack.map((s)=> {
                            if(s.step === item.step) {
                                s.message = 'Done';
                                s.status = true;
                                if(s.step === 'Finishing')
                                    setReady(true);
                            }
                            return s;
                        }));
                    else
                        setStack(stack.map((s)=> {
                            if(s.step === item.step) {
                                s.message = response.message;
                                s.status = false;
                            }
                            return s;
                        }));
                });
                break;
            }
        }
    });
    return <div className="uk-align-center">
        <div className="uk-text-center"><h3>Welcome to Similik</h3></div>
        {(letsGo !== true && letsGo !== undefined) && <div className="text-danger">{isSuccess}</div>}
        {letsGo !== true && <Form
            id = "installation-form"
            submitText="Let's go"
            action = {action}
            onComplete={(response)=> {
                if(response.success === 1)
                    dispatch({'type': ADD_APP_STATE, 'payload': {appState: {letsGo: true}}});
                else
                    dispatch({'type': ADD_APP_STATE, 'payload': {appState: {letsGo: _.get(response, 'message', 'Something wrong. Please check again information')}}});
            }}
        >
            <div className="uk-grid uk-grid-small">
                <DBInfo/>
                <AdminUser/>
            </div>
        </Form>}
        {letsGo === true && <ul className="installation-stack uk-list">
            {stack.map((s, i)=> {
                return <li key={i}>
                    <span>{s.step} </span>
                    {s.status === undefined && <span>{s.message}</span>}
                    {s.status === true && <span className="text-success">{s.message}</span>}
                    {s.status === false && <span className="text-danger">{s.message}</span>}
                </li>
            })}
        </ul>}
        {ready === true && <Welcome/>}
    </div>
}