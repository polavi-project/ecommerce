import { Form } from "../../../../../../../js/production/form/form.js";
import Area from "../../../../../../../js/production/area.js";
import Text from "../../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../../js/production/form/fields/select.js";
import { CountryOptions } from "../../../../../../../js/production/locale/country_option.js";
import Multiselect from "../../../../../../../js/production/form/fields/multiselect.js";
import { LanguageOptions } from "../../../../../../../js/production/locale/language_option.js";
import { Fetch } from "../../../../../../../js/production/fetch.js";

function NoImagePlaceHolder({ value = null }) {
    const uploadApi = ReactRedux.useSelector(state => _.get(state, 'appState.graphqlApi'));
    const baseUrl = ReactRedux.useSelector(state => _.get(state, 'appState.baseUrl'));
    const [image, setImage] = React.useState({ path: value, url: baseUrl + "/media/" + value });

    const onChange = e => {
        e.persist();
        let formData = new FormData();
        formData.append('file', e.target.files[0]);
        formData.append('query', `mutation UploadProductImage { uploadMedia (targetPath: "upload") {files {status message file {url path}}}}`);

        Fetch(uploadApi, false, "POST", formData, null, response => {
            if (_.get(response, 'payload.data.uploadMedia.files')) {
                _.get(response, 'payload.data.uploadMedia.files').forEach((e, i) => {
                    if (e.status === true) setImage(e.file);
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
                "No Image Placeholder"
            )
        ),
        image.path !== null && React.createElement(
            "div",
            null,
            React.createElement("img", { src: image.url, style: { width: '50px', height: '50px' } })
        ),
        image.path !== null && React.createElement("input", { type: "hidden", name: "catalog_logo", value: image.path, readOnly: true }),
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
                name: "catalog_allow_countries[]",
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
                formId: "catalog_setting_form",
                validation_rules: ['notEmpty'],
                label: "Language",
                name: "catalog_default_language",
                className: "uk-form-small"
            })
        )
    );
}

export default function CatalogSettingForms(props) {
    const [fields] = React.useState(() => {
        return [{
            component: Text,
            props: { id: 'catalog_display_mode', formId: "catalog_setting_form", name: "catalog_display_mode", label: "Product listing mode", validation_rules: ["notEmpty"] },
            sort_order: 10,
            id: "catalog_display_mode"
        }, {
            component: Text,
            props: { id: 'catalog_product_list_limit', formId: "catalog_setting_form", name: "catalog_product_list_limit", label: "Number of product in listing page" },
            sort_order: 20,
            id: "catalog_product_list_limit"
        }, {
            component: NoImagePlaceHolder,
            props: { name: "catalog_no_image_placeholder" },
            sort_order: 30,
            id: "catalog_no_image_placeholder"
        }, {
            component: Select,
            props: { id: 'catalog_out_of_stock_display', formId: "catalog_setting_form", name: "catalog_out_of_stock_display", label: "Display out of stock product?", options: [{ value: 0, text: 'No' }, { value: 1, text: 'Yes' }], validation_rules: ["notEmpty"] },
            sort_order: 40,
            id: "catalog_out_of_stock_display"
        }, {
            component: Text,
            props: { id: 'catalog_product_list_image_width', formId: "catalog_setting_form", name: "catalog_product_list_image_width", label: "Product image width in listing page" },
            sort_order: 50,
            id: "catalog_product_list_image_width"
        }, {
            component: Text,
            props: { id: 'catalog_product_list_image_height', formId: "catalog_setting_form", name: "catalog_product_list_image_height", label: "Product image height in listing page" },
            sort_order: 60,
            id: "catalog_product_list_image_height"
        }, {
            component: Text,
            props: { id: 'catalog_product_detail_image_width', formId: "catalog_setting_form", name: "catalog_product_detail_image_width", label: "Product image width in detail page" },
            sort_order: 70,
            id: "catalog_product_detail_image_width"
        }, {
            component: Text,
            props: { id: 'catalog_product_detail_image_height', formId: "catalog_setting_form", name: "catalog_product_detail_image_height", label: "Product image height in detail page" },
            sort_order: 80,
            id: "catalog_product_detail_image_height"
        }].filter(f => {
            if (_.get(props, `data.${f.props.name}`) !== undefined) f.props.value = _.get(props, `data.${f.props.name}`);
            return f;
        });
    });

    return React.createElement(
        "div",
        { className: "uk-flex-center" },
        React.createElement(
            Form,
            { id: "catalog_setting_form", action: props.action },
            React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "strong",
                        null,
                        "Catalog setting"
                    )
                )
            ),
            React.createElement(Area, { id: "catalog_setting_form_inner", coreWidgets: fields })
        )
    );
}