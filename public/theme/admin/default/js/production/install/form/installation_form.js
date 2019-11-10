import { Form } from "../../../../../../../js/production/form/form.js";
import Text from "../../../../../../../js/production/form/fields/text.js";
import Password from "../../../../../../../js/production/form/fields/password.js";
import { ADD_APP_STATE } from "../../../../../../../js/dev/event-types.js";
import { InstallSettingModule } from "../../setting/install/install.js";
import { InstallCatalogModule } from "../../catalog/install/install.js";
import { InstallCmsModule } from "../../cms/install/install.js";
import { InstallDiscountModule } from "../../discount/install/install.js";
import { InstallCheckoutModule } from "../../checkout/install/install.js";
import { InstallCustomerModule } from "../../customer/install/install.js";
import { InstallTaxModule } from "../../tax/install/install.js";
import { FinishInstallation } from "./finish.js";

function DBInfo() {
    return React.createElement(
        "div",
        { className: "uk-width-1-2" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "strong",
                null,
                "Database information"
            )
        ),
        React.createElement(
            "p",
            null,
            "Please provide your database connection information."
        ),
        React.createElement(
            "div",
            null,
            React.createElement(Text, {
                formId: "installation-form",
                name: "db_name",
                label: "Database name",
                value: "",
                validation_rules: ['notEmpty']
            }),
            React.createElement(Text, {
                formId: "installation-form",
                name: "db_user",
                label: "Database user",
                value: "",
                validation_rules: ['notEmpty']
            }),
            React.createElement(Text, {
                formId: "installation-form",
                name: "db_password",
                label: "Database password",
                value: ""
            }),
            React.createElement(Text, {
                formId: "installation-form",
                name: "db_host",
                label: "Database host",
                value: "localhost",
                validation_rules: ['notEmpty']
            })
        )
    );
}

function AdminUser() {
    return React.createElement(
        "div",
        { className: "uk-width-1-2" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "strong",
                null,
                "Admin user information"
            )
        ),
        React.createElement(
            "div",
            null,
            React.createElement(Text, {
                formId: "installation-form",
                name: "full_name",
                label: "Full name",
                value: "",
                validation_rules: ['notEmpty']
            }),
            React.createElement(Text, {
                formId: "installation-form",
                name: "email",
                label: "Email",
                value: "",
                validation_rules: ['notEmpty', 'email']
            }),
            React.createElement(Password, {
                formId: "installation-form",
                name: "password",
                label: "Password",
                value: "",
                validation_rules: ['notEmpty']
            })
        )
    );
}

export default function Installation({ action }) {
    const letsGo = ReactRedux.useSelector(state => _.get(state, 'appState.letsGo'));
    const dispatch = ReactRedux.useDispatch();
    React.useEffect(() => {
        dispatch({ 'type': ADD_APP_STATE, 'payload': {
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
            } });
    }, []);
    return React.createElement(
        "div",
        { className: "uk-align-center" },
        React.createElement(
            "div",
            { className: "uk-text-center" },
            React.createElement(
                "h3",
                null,
                "Welcome to Similik"
            )
        ),
        letsGo !== true && letsGo !== undefined && React.createElement(
            "div",
            { className: "text-danger" },
            isSuccess
        ),
        letsGo !== true && React.createElement(
            Form,
            {
                id: "installation-form",
                submitText: "Let's go",
                action: action,
                onComplete: response => {
                    if (response.success === 1) dispatch({ 'type': ADD_APP_STATE, 'payload': { appState: { letsGo: true } } });else dispatch({ 'type': ADD_APP_STATE, 'payload': { appState: { letsGo: _.get(response, 'message', 'Something wrong. Please check again information') } } });
                }
            },
            React.createElement(
                "div",
                { className: "uk-grid uk-grid-small" },
                React.createElement(DBInfo, null),
                React.createElement(AdminUser, null)
            )
        ),
        React.createElement(
            "ul",
            { className: "installation-stack uk-list" },
            React.createElement(InstallSettingModule, null),
            React.createElement(InstallCatalogModule, null),
            React.createElement(InstallCmsModule, null),
            React.createElement(InstallDiscountModule, null),
            React.createElement(InstallCheckoutModule, null),
            React.createElement(InstallCustomerModule, null),
            React.createElement(InstallTaxModule, null),
            React.createElement(FinishInstallation, null)
        )
    );
}