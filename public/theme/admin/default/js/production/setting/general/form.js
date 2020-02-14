var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Form } from "../../../../../../../js/production/form/form.js";
import Area from "../../../../../../../js/production/area.js";
import Text from "../../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../../js/production/form/fields/select.js";
import { CountryOptions } from "../../../../../../../js/production/locale/country_option.js";
import Multiselect from "../../../../../../../js/production/form/fields/multiselect.js";
import { LanguageOptions } from "../../../../../../../js/production/locale/language_option.js";
import { CurrencyOptions } from "../../../../../../../js/production/locale/currency_option.js";
import { TimezoneOptions } from "../../../../../../../js/production/locale/timezone_option.js";
import { Fetch } from "../../../../../../../js/production/fetch.js";

function Logo({ value = null }) {
    const uploadApi = ReactRedux.useSelector(state => _.get(state, 'appState.graphqlApi'));
    const baseUrl = ReactRedux.useSelector(state => _.get(state, 'appState.baseUrl'));
    const [logo, setLogo] = React.useState({ path: value, url: baseUrl + "/public/media/" + value });

    const onChange = e => {
        e.persist();
        let formData = new FormData();
        formData.append('file', e.target.files[0]);
        formData.append('query', `mutation UploadProductImage { uploadMedia (targetPath: "upload") {files {status message file {url path}}}}`);

        Fetch(uploadApi, false, "POST", formData, null, response => {
            if (_.get(response, 'payload.data.uploadMedia.files')) {
                _.get(response, 'payload.data.uploadMedia.files').forEach((e, i) => {
                    if (e.status === true) setLogo(e.file);
                });
            }
        }, null, () => {
            e.target.value = null;
        });
    };

    return React.createElement(
        "div",
        null,
        React.createElement(
            "div",
            null,
            React.createElement(
                "span",
                null,
                "Logo"
            )
        ),
        logo.path !== null && React.createElement(
            "div",
            null,
            React.createElement("img", { src: logo.url, style: { width: '50px', height: '50px' } })
        ),
        logo.path !== null && React.createElement("input", { type: "hidden", name: "general_logo", value: logo.path, readOnly: true }),
        React.createElement("input", { type: "file", onChange: onChange, title: "Upload" })
    );
}

function Country({ value = [] }) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            CountryOptions,
            null,
            React.createElement(Multiselect, {
                value: value,
                label: "Allow countries",
                name: "general_allow_countries[]",
                className: "uk-form-small"
            })
        )
    );
}

function Language({ value = 26 }) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            LanguageOptions,
            null,
            React.createElement(Select, {
                value: value,
                formId: "general_setting_form",
                validation_rules: ['notEmpty'],
                label: "Language",
                name: "general_default_language",
                className: "uk-form-small"
            })
        )
    );
}

function Currency({ value = 'USD' }) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            CurrencyOptions,
            null,
            React.createElement(Select, {
                value: value,
                formId: "general_setting_form",
                validation_rules: ['notEmpty'],
                label: "Currency",
                name: "general_currency",
                className: "uk-form-small"
            })
        )
    );
}

function Timezone({ value = 'Europe/London' }) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            TimezoneOptions,
            null,
            React.createElement(Select, {
                value: value,
                formId: "general_setting_form",
                label: "Timezone",
                name: "general_timezone",
                className: "uk-form-small"
            })
        )
    );
}

function General(props) {
    return React.createElement(
        "div",
        { className: "uk-width-1-3" },
        React.createElement(
            "div",
            { className: "border-block" },
            React.createElement(
                "div",
                null,
                React.createElement(
                    "strong",
                    null,
                    "General"
                )
            ),
            React.createElement(Area, {
                id: "general_setting_form_general",
                coreWidgets: [{
                    component: Text,
                    props: {
                        id: 'general_store_name',
                        formId: "general_setting_form",
                        name: "general_store_name",
                        label: "Store name",
                        validation_rules: ["notEmpty"],
                        value: _.get(props, 'general_store_name')
                    },
                    sort_order: 10,
                    id: "general_store_name"
                }, {
                    component: Text,
                    props: {
                        id: 'general_store_contact_telephone',
                        formId: "general_setting_form",
                        name: "general_store_contact_telephone",
                        label: "Contact phone",
                        validation_rules: ["notEmpty"],
                        value: _.get(props, 'general_store_contact_telephone')
                    },
                    sort_order: 20,
                    id: "general_store_contact_telephone"
                }, {
                    component: Language,
                    props: {
                        name: "general_default_language",
                        value: _.get(props, 'general_default_language')
                    },
                    sort_order: 30,
                    id: "general_default_language"
                }]
            })
        )
    );
}

function Ecommerce(props) {
    return React.createElement(
        "div",
        { className: "uk-width-1-3" },
        React.createElement(
            "div",
            { className: "border-block" },
            React.createElement(
                "div",
                null,
                React.createElement(
                    "strong",
                    null,
                    "E-Commerce"
                )
            ),
            React.createElement(Area, {
                id: "general_setting_form_ecommerce",
                coreWidgets: [{
                    component: Country,
                    props: {
                        name: "general_allow_countries",
                        value: _.get(props, 'general_allow_countries')
                    },
                    sort_order: 10,
                    id: "general_allow_countries"
                }, {
                    component: Currency,
                    props: {
                        name: "general_currency",
                        value: _.get(props, 'general_currency')
                    },
                    sort_order: 20,
                    id: "general_currency"
                }, {
                    component: Timezone,
                    props: {
                        name: "general_timezone",
                        value: _.get(props, 'general_timezone')
                    },
                    sort_order: 30,
                    id: "general_timezone"
                }]
            })
        )
    );
}

function Web(props) {
    return React.createElement(
        "div",
        { className: "uk-width-1-3" },
        React.createElement(
            "div",
            { className: "border-block" },
            React.createElement(
                "div",
                null,
                React.createElement(
                    "strong",
                    null,
                    "Web"
                )
            ),
            React.createElement(Area, {
                id: "general_setting_form_web",
                coreWidgets: [{
                    component: Logo,
                    props: {
                        name: "general_logo",
                        value: _.get(props, 'general_logo')
                    },
                    sort_order: 10,
                    id: "general_logo"
                }, {
                    component: Text,
                    props: {
                        id: 'general_logo_width',
                        formId: "general_setting_form",
                        name: "general_logo_width",
                        label: "Logo width(pixel)",
                        value: _.get(props, 'general_logo_width')
                    },
                    sort_order: 20,
                    id: "general_logo_width"
                }, {
                    component: Text,
                    props: {
                        id: 'general_logo_height',
                        formId: "general_setting_form",
                        name: "general_logo_height",
                        label: "Logo height(pixel)",
                        value: _.get(props, 'general_logo_height')
                    },
                    sort_order: 30,
                    id: "general_logo_height"
                }, {
                    component: Select,
                    props: {
                        id: 'general_https',
                        formId: "general_setting_form",
                        name: "general_https",
                        label: "Use https?",
                        options: [{ value: 0, text: 'No' }, { value: 1, text: 'Yes' }],
                        value: _.get(props, 'general_https')
                    },
                    sort_order: 40,
                    id: "general_https"
                }]
            })
        )
    );
}

export default function GeneralSettingForms(props) {
    return React.createElement(
        "div",
        { className: "uk-flex-center" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "h2",
                null,
                "General setting"
            )
        ),
        React.createElement(
            Form,
            { id: "general_setting_form", action: props.action },
            React.createElement(Area, { id: "general_setting_form_inner", className: "uk-grid uk-grid-small", coreWidgets: [{
                    component: General,
                    props: _extends({}, props.data),
                    sort_order: 10,
                    id: "general_setting_general"
                }, {
                    component: Ecommerce,
                    props: _extends({}, props.data),
                    sort_order: 20,
                    id: "general_setting_catalog"
                }, {
                    component: Web,
                    props: _extends({}, props.data),
                    sort_order: 30,
                    id: "general_setting_form_web"
                }] })
        )
    );
}