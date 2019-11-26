var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Form } from "../../../../../../../js/production/form/form.js";
import Area from "../../../../../../../js/production/area.js";
import Text from "../../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../../js/production/form/fields/select.js";
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

function ListingPage(props) {
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
                    "Listing page"
                )
            ),
            React.createElement(Area, {
                id: "catalog_setting_form_listing",
                coreWidgets: [{
                    component: Text,
                    props: {
                        id: "catalog_product_list_limit",
                        formId: "catalog_setting_form",
                        name: "catalog_product_list_limit",
                        label: "Number of product in listing page",
                        value: props.catalog_product_list_limit
                    },
                    sort_order: 20,
                    id: "catalog_product_list_limit"
                }, {
                    component: Select,
                    props: {
                        id: "catalog_product_list_sort_by",
                        formId: "catalog_setting_form",
                        name: "catalog_product_list_sort_by",
                        label: "Default sort by",
                        value: props.catalog_product_list_sort_by,
                        options: [{ value: 'price', text: 'Price' }, { value: 'name', text: 'Name' }, { value: 'created_at', text: 'Created date' }]
                    },
                    sort_order: 30,
                    id: "catalog_product_list_sort_by"
                }, {
                    component: Select,
                    props: {
                        id: "catalog_product_list_sort_order",
                        formId: "catalog_setting_form",
                        name: "catalog_product_list_sort_order",
                        label: "Default sort order",
                        value: props.catalog_product_list_sort_order,
                        options: [{ value: 'ASC', text: 'Low to high' }, { value: 'DESC', text: 'High to low' }]
                    },
                    sort_order: 40,
                    id: "catalog_product_list_sort_order"
                }, {
                    component: Text,
                    props: {
                        id: "catalog_product_list_image_width",
                        formId: "catalog_setting_form",
                        name: "catalog_product_list_image_width",
                        label: "Product image width in listing page",
                        value: props.catalog_product_list_image_width
                    },
                    sort_order: 50,
                    id: "catalog_product_list_image_width"
                }, {
                    component: Text,
                    props: {
                        id: "catalog_product_list_image_height",
                        formId: "catalog_setting_form",
                        name: "catalog_product_list_image_height",
                        label: "Product image height in listing page",
                        value: props.catalog_product_list_image_height
                    },
                    sort_order: 60,
                    id: "catalog_product_list_image_height"
                }]
            })
        )
    );
}

function DetailPage(props) {
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
                    "Detail page"
                )
            ),
            React.createElement(Area, {
                id: "catalog_setting_form_detail",
                coreWidgets: [{
                    component: Text,
                    props: {
                        id: "catalog_product_detail_image_width",
                        formId: "catalog_setting_form",
                        name: "catalog_product_detail_image_width",
                        label: "Product image width in detail page",
                        value: props.catalog_product_detail_image_width
                    },
                    sort_order: 10,
                    id: "catalog_product_detail_image_width"
                }, {
                    component: Text,
                    props: {
                        id: "catalog_product_detail_image_height",
                        formId: "catalog_setting_form",
                        name: "catalog_product_detail_image_height",
                        label: "Product image height in detail page",
                        value: props.catalog_product_detail_image_height
                    },
                    sort_order: 20,
                    id: "catalog_product_detail_image_height"
                }]
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
                id: "catalog_setting_form_general",
                coreWidgets: [{
                    component: Select,
                    props: {
                        id: 'catalog_out_of_stock_display',
                        formId: "catalog_setting_form",
                        name: "catalog_out_of_stock_display",
                        label: "Display out of stock product?",
                        options: [{ value: 0, text: 'No' }, { value: 1, text: 'Yes' }],
                        validation_rules: ["notEmpty"],
                        value: props.catalog_out_of_stock_display
                    },
                    sort_order: 10,
                    id: "catalog_out_of_stock_display"
                }, {
                    component: NoImagePlaceHolder,
                    props: {
                        name: "catalog_no_image_placeholder"
                    },
                    sort_order: 20,
                    id: "catalog_no_image_placeholder"
                }]
            })
        )
    );
}

export default function CatalogSettingForms(props) {
    return React.createElement(
        "div",
        { className: "uk-flex-center" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "h2",
                null,
                "Catalog"
            )
        ),
        React.createElement(
            Form,
            { id: "catalog_setting_form", action: props.action },
            React.createElement(Area, { id: "catalog_setting_form_inner", className: "uk-grid uk-grid-small", coreWidgets: [{
                    component: General,
                    props: _extends({}, props.data),
                    sort_order: 10,
                    id: "catalog_setting_general"
                }, {
                    component: ListingPage,
                    props: _extends({}, props.data),
                    sort_order: 20,
                    id: "catalog_setting_listing"
                }, {
                    component: DetailPage,
                    props: _extends({}, props.data),
                    sort_order: 30,
                    id: "catalog_setting_detail"
                }] })
        )
    );
}