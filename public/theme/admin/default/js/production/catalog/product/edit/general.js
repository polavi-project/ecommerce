import Area from "../../../../../../../../js/production/area.js";
import Text from "../../../../../../../../js/production/form/fields/text.js";
import TextArea from "../../../../../../../../js/production/form/fields/textarea.js";
import Select from "../../../../../../../../js/production/form/fields/select.js";
import Tinycme from "../../../../../../../../js/production/form/fields/tinycme.js";
import Radio from "../../../../../../../../js/production/form/fields/radio.js";
import Checkbox from "../../../../../../../../js/production/form/fields/checkbox.js";
import Switch from "../../../../../../../../js/production/form/fields/switch.js";

export default function General({ data }) {
    const [fields] = React.useState(() => {
        return [{
            component: Text,
            props: { id: 'name', formId: "product-edit-form", name: "name", label: "Name", validation_rules: ["notEmpty"] },
            sort_order: 10,
            id: "name"
        }, {
            component: Text,
            props: { id: 'sku', formId: "product-edit-form", name: "sku", label: "SKU", validation_rules: ["notEmpty"], isTranslateAble: false },
            sort_order: 20,
            id: "sku"
        }, {
            component: Switch,
            props: { id: 'status', formId: "product-edit-form", name: "status", label: "Status", options: [{ value: 0, text: 'Disabled' }, { value: 1, text: 'Enabled' }], isTranslateAble: false },
            sort_order: 30,
            id: "status"
        }, {
            component: Text,
            props: { id: 'weight', formId: "product-edit-form", name: "weight", type: "text", label: "Weight", validation_rules: ["notEmpty", "decimal"], isTranslateAble: false },
            sort_order: 40,
            id: "weight"
        }, {
            component: Text,
            props: { id: 'price', formId: "product-edit-form", name: "price", label: "Price", validation_rules: ["notEmpty"], isTranslateAble: false },
            sort_order: 50,
            id: "price"
        }, {
            component: Tinycme,
            props: { id: 'short_description', formId: "product-edit-form", name: "short_description", label: "Short description" },
            sort_order: 60,
            id: "short_description"
        }, {
            component: TextArea,
            props: { id: 'description', formId: "product-edit-form", name: "description", label: "Description" },
            sort_order: 70,
            id: "description"
        }].filter(f => {
            if (_.get(data, f.props.name) !== undefined) f.props.value = _.get(data, f.props.name);
            return f;
        });
    });

    return React.createElement(
        "div",
        { className: "product-edit-general sml-block" },
        React.createElement(
            "div",
            { className: "sml-block-title" },
            "General"
        ),
        React.createElement(Area, { id: "product-edit-general", coreWidgets: fields })
    );
}