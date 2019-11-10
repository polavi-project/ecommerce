import {Form} from "../../../../../../../js/production/form/form.js";
import Text from "../../../../../../../js/production/form/fields/text.js";
import Password from "../../../../../../../js/production/form/fields/password.js";
import {ADD_APP_STATE} from "../../../../../../../js/dev/event-types.js";
import {InstallSettingModule} from "../../setting/install/install.js";
import {InstallCatalogModule} from "../../catalog/install/install.js";
import {InstallCmsModule} from "../../cms/install/install.js";
import {InstallDiscountModule} from "../../discount/install/install.js";
import {InstallCheckoutModule} from "../../checkout/install/install.js";
import {InstallCustomerModule} from "../../customer/install/install.js";
import {InstallTaxModule} from "../../tax/install/install.js";
import {FinishInstallation} from "./finish.js";

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

export default function Installation({action}) {
    const letsGo = ReactRedux.useSelector(state => _.get(state, 'appState.letsGo'));
    const dispatch = ReactRedux.useDispatch();
    React.useEffect(() => {
        dispatch({'type': ADD_APP_STATE, 'payload': {
            appState: {
                modules: {
                    setting: false,
                    catalog: false,
                    customer: false,
                    tax: false,
                    checkout: false,
                    cms: false,
                    discount: false
                }
            }
        }});
    }, []);
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
        <ul className="installation-stack uk-list">
            <InstallSettingModule/>
            <InstallCatalogModule/>
            <InstallCmsModule/>
            <InstallDiscountModule/>
            <InstallCheckoutModule/>
            <InstallCustomerModule/>
            <InstallTaxModule/>
            <FinishInstallation/>
        </ul>
    </div>
}