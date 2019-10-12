import Text from "../../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../../js/production/form/fields/select.js";
import { AreaList } from "../../../production/cms/widget/area_list.js";
import { Form } from "../../../../../../../js/production/form/form.js";
import { ADD_ALERT } from "../../../../../../../js/production/event-types.js";
import { Fetch } from "../../../../../../../js/production/fetch.js";
import { LayoutList } from "../../../production/cms/widget/layout_list.js";

export default function FeaturedProductWidget({ id, name, status, setting, displaySetting, sortOrder, formAction, areaProps }) {
    const layout = _.find(displaySetting, { key: 'layout' }) !== undefined ? JSON.parse(_.get(_.find(displaySetting, { key: 'layout' }), 'value', [])) : [];

    const area = _.find(displaySetting, { key: 'area' }) !== undefined ? JSON.parse(_.get(_.find(displaySetting, { key: 'area' }), 'value', [])) : [];

    const dispatch = ReactRedux.useDispatch();

    const onComplete = response => {
        if (_.get(response, 'payload.data.createWidget.status') === true) {
            dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: "widget_update_success", message: 'Widget has been saved successfully', type: "success" }] } });
            Fetch(areaProps.requestUrl, true);
        } else dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: "widget_update_error", message: _.get(response, 'payload.data.createWidget.message', 'Something wrong, please try again'), type: "error" }] } });
    };

    const [products, setProducts] = React.useState(_.find(setting, { key: 'products' }) !== undefined ? JSON.parse(_.get(_.find(setting, { key: 'products' }), 'value', [])) : []);

    const addProduct = e => {
        e.preventDefault();
        if (e.target.value.trim() !== "") setProducts(products.concat(e.target.value));
    };

    const removeProducts = sku => {
        const newProducts = products.filter(p => p !== sku);
        setProducts(newProducts);
    };

    return React.createElement(
        "div",
        null,
        React.createElement(
            Form,
            {
                id: "featured-product-widget-edit-form",
                action: formAction,
                onComplete: onComplete
            },
            React.createElement("input", { type: "text", name: "query", value: "mutation CreateTextWidget($widget: WidgetInput!) { createWidget (widget: $widget) {status message}}", readOnly: true, style: { display: 'none' } }),
            React.createElement("input", { type: "text", name: "variables[widget][type]", value: "featured_products", readOnly: true, style: { display: 'none' } }),
            id && React.createElement("input", { type: "text", name: "variables[widget][id]", value: id, readOnly: true, style: { display: 'none' } }),
            React.createElement(Text, {
                name: "variables[widget][name]",
                value: name,
                formId: "text-widget-edit-form",
                validation_rules: ['notEmpty'],
                label: "Name"
            }),
            React.createElement(Select, {
                name: "variables[widget][status]",
                value: status,
                formId: "text-widget-edit-form",
                options: [{ value: '1', text: 'Enable' }, { value: '0', text: 'Disable' }],
                label: "Status"
            }),
            React.createElement("input", { type: "text", name: "variables[widget][setting][0][key]", value: "products", readOnly: true, style: { display: 'none' } }),
            React.createElement(
                "div",
                null,
                React.createElement(
                    "span",
                    null,
                    "Products"
                )
            ),
            React.createElement("input", {
                className: "uk-input",
                type: "text", defaultValue: "",
                onKeyPress: e => {
                    if (e.key === 'Enter') addProduct(e);
                },
                placeholder: "Product sku"
            }),
            React.createElement(
                "div",
                { className: "" },
                products.map((p, i) => {
                    return React.createElement(
                        "span",
                        { key: i },
                        React.createElement("span", { "uk-icon": "icon: close; ratio: 0.5", onClick: () => removeProducts(p) }),
                        React.createElement(
                            "span",
                            null,
                            " ",
                            p
                        ),
                        React.createElement("input", { type: "text", name: "variables[widget][setting][0][value][]", value: p, readOnly: true, style: { display: 'none' } })
                    );
                })
            ),
            React.createElement(
                "div",
                null,
                "Select page layout"
            ),
            React.createElement(LayoutList, { formId: "text-widget-edit-form", selectedLayouts: layout }),
            React.createElement(
                "div",
                null,
                "Select area"
            ),
            React.createElement(AreaList, { formId: "text-widget-edit-form", selectedAreas: area }),
            React.createElement(Text, {
                name: "variables[widget][sort_order]",
                value: sortOrder,
                formId: "text-widget-edit-form",
                label: "Sort order"
            })
        )
    );
}