import {Form} from "../../../../../../../js/production/form/form.js"
import Area from "../../../../../../../js/production/area.js"
import Text from "../../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../../js/production/form/fields/select.js";
import {CountryOptions} from "../../../../../../../js/production/locale/country_option.js";
import Multiselect from "../../../../../../../js/production/form/fields/multiselect.js";
import {LanguageOptions} from "../../../../../../../js/production/locale/language_option.js";
import {CurrencyOptions} from "../../../../../../../js/production/locale/currency_option.js";
import {TimezoneOptions} from "../../../../../../../js/production/locale/timezone_option.js";
import {Fetch} from "../../../../../../../js/production/fetch.js";
import TextArea from "../../../../../../../js/production/form/fields/textarea.js";

function Logo({value = null}) {
    const uploadApi = ReactRedux.useSelector(state => _.get(state, 'appState.graphqlApi'));
    const baseUrl = ReactRedux.useSelector(state => _.get(state, 'appState.baseUrl'));
    const [logo, setLogo] = React.useState({path: value, url: baseUrl + "/public/media/" + value});

    const onChange = (e) => {
        e.persist();
        let formData = new FormData();
        formData.append('file', e.target.files[0]);
        formData.append('query', `mutation UploadProductImage { uploadMedia (targetPath: "upload") {files {status message file {url path}}}}`);

        Fetch(
            uploadApi,
            false,
            "POST",
            formData,
            null,
            (response) => {
                if(_.get(response, 'payload.data.uploadMedia.files')) {
                    _.get(response, 'payload.data.uploadMedia.files').forEach((e,i) => {
                        if(e.status === true)
                            setLogo(e.file)
                    });
                }
            },
            null,
            () => {
                e.target.value = null;
            }
        );
    };

    return <div>
        <div><span>Logo</span></div>
        {logo.path !== null && <div><img src={logo.url} style={{width: '50px', height: '50px'}}/></div>}
        {logo.path !== null && <input type="hidden" name="general_logo" value={logo.path} readOnly={true}/>}
        <input type="file" onChange={onChange} title="Upload"/>
    </div>
}

function Country({value = []}) {
    return <div>
        <CountryOptions>
            <Multiselect
                value={value}
                label="Allow countries"
                name="general_allow_countries[]"
                className="uk-form-small"
            />
        </CountryOptions>
    </div>
}

function Language({value = 26}) {
    return <div>
        <LanguageOptions>
            <Select
                value={value}
                formId="general_setting_form"
                validation_rules={['notEmpty']}
                label="Language"
                name="general_default_language"
                className="uk-form-small"
            />
        </LanguageOptions>
    </div>
}

function Currency({value = 'USD'}) {
    return <div>
        <CurrencyOptions>
            <Select
                value={value}
                formId="general_setting_form"
                validation_rules={['notEmpty']}
                label="Currency"
                name="general_currency"
                className="uk-form-small"
            />
        </CurrencyOptions>
    </div>
}

function Timezone({value = 'Europe/London'}) {
    return <div>
        <TimezoneOptions>
            <Select
                value={value}
                formId="general_setting_form"
                label="Timezone"
                name="general_timezone"
                className="uk-form-small"
            />
        </TimezoneOptions>
    </div>
}

export default function GeneralSettingForms(props) {
    const [left] = React.useState(() => {
        return  [
            {
                component: Text,
                props : {id : 'general_store_name', formId: "general_setting_form", name: "general_store_name", label: "Store name", validation_rules:["notEmpty"]},
                sort_order: 10,
                id: "general_store_name"
            },
            {
                component: Logo,
                props : {name: "general_logo"},
                sort_order: 15,
                id: "general_logo"
            },
            {
                component: Text,
                props : {id : 'general_logo_width', formId: "general_setting_form", name: "general_logo_width", label: "Logo width(pixel)"},
                sort_order: 16,
                id: "general_logo_width"
            },
            {
                component: Text,
                props : {id : 'general_logo_height', formId: "general_setting_form", name: "general_logo_height", label: "Logo height(pixel)"},
                sort_order: 17,
                id: "general_logo_height"
            },
            {
                component: Text,
                props : {id : 'general_store_contact_telephone', formId: "general_setting_form", name: "general_store_contact_telephone", label: "Contact phone", validation_rules:["notEmpty"]},
                sort_order: 20,
                id: "general_store_contact_telephone"
            }
        ].filter((f) => {
            if(_.get(props, `data.${f.props.name}`) !== undefined)
                f.props.value = _.get(props, `data.${f.props.name}`);
            return f;
        })
    });

    const [right] = React.useState(() => {
        return  [
            {
                component: Country,
                props : {name: "general_allow_countries"},
                sort_order: 30,
                id: "general_allow_countries"
            },
            {
                component: Language,
                props : {name: "general_default_language"},
                sort_order: 40,
                id: "general_default_language"
            },
            {
                component: Currency,
                props : {name: "general_currency"},
                sort_order: 50,
                id: "general_currency"
            },
            {
                component: Timezone,
                props : {name: "general_timezone"},
                sort_order: 60,
                id: "general_timezone"
            },
            {
                component: Text,
                props : {
                    name: "general_google_tag",
                    label: "Google tag manage ID"
                },
                sort_order: 70,
                id: "general_google_tag"
            }
        ].filter((f) => {
            if(_.get(props, `data.${f.props.name}`) !== undefined)
                f.props.value = _.get(props, `data.${f.props.name}`);
            return f;
        })
    });

    return <div className="uk-flex-center">
        <Form id="general_setting_form" action={props.action}>
            <div>
                <div><h2>General setting</h2></div>
            </div>
            <div className="uk-grid uk-grid-small">
                <Area id="general_setting_form_left" coreWidgets={left} className="uk-width-1-2"/>
                <Area id="general_setting_form_right" coreWidgets={right} className="uk-width-1-2"/>
            </div>
        </Form>
    </div>
}