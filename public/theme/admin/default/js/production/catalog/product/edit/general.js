import Area from "../../../../../../../../js/production/area.js";
import Text from "../../../../../../../../js/production/form/fields/text.js";
import TextArea from "../../../../../../../../js/production/form/fields/textarea.js";
import Select from "../../../../../../../../js/production/form/fields/select.js";
import Tinycme from "../../../../../../../../js/production/form/fields/tinycme.js";

export default function General({ data }) {
    const [fields] = React.useState(() => {
        return [{
            component: Text,
            props: { id: 'name', formId: "product-edit-form", name: "name", label: "Name", validation_rules: ["notEmpty"] },
            sort_order: 10,
            id: "name"
        }, {
            component: Text,
            props: { id: 'price', formId: "product-edit-form", name: "price", label: "Price", validation_rules: ["notEmpty"], isTranslateAble: false },
            sort_order: 20,
            id: "price"
        }, {
            component: Tinycme,
            props: { id: 'short_description', formId: "product-edit-form", name: "short_description", label: "Short description" },
            sort_order: 30,
            id: "short_description"
        }, {
            component: TextArea,
            props: { id: 'description', formId: "product-edit-form", name: "description", label: "Description" },
            sort_order: 40,
            id: "description"
        }, {
            component: Text,
            props: { id: 'sku', formId: "product-edit-form", name: "sku", label: "SKU", validation_rules: ["notEmpty"], isTranslateAble: false },
            sort_order: 50,
            id: "sku"
        }, {
            component: Text,
            props: { id: 'weight', formId: "product-edit-form", name: "weight", type: "text", label: "Weight", validation_rules: ["notEmpty", "decimal"], isTranslateAble: false },
            sort_order: 60,
            id: "weight"
        }, {
            component: Select,
            props: { id: 'status', formId: "product-edit-form", name: "status", type: "select", label: "Status", options: [{ value: 0, text: 'Disabled' }, { value: 1, text: 'Enabled' }], isTranslateAble: false },
            sort_order: 70,
            id: "status"
        }, {
            component: Select,
            props: { id: "manage_stock", formId: "product-edit-form", name: "manage_stock", type: "select", label: "Manage stock?", options: [{ value: 0, text: 'No' }, { value: 1, text: 'Yes' }], isTranslateAble: false },
            sort_order: 80,
            id: "manage_stock"
        }, {
            component: Text,
            props: { id: "qty", formId: "product-edit-form", name: "qty", type: "text", label: "Quantity", validation_rules: ["notEmpty", "integer"], isTranslateAble: false },
            sort_order: 90,
            id: "qty"
        }, {
            component: Select,
            props: { id: "stock_availability", formId: "product-edit-form", name: "stock_availability", type: "select", label: "Stock availability", options: [{ value: 0, text: 'Out of stock' }, { value: 1, text: 'In stock' }], validation_rules: ["notEmpty"], isTranslateAble: false },
            sort_order: 100,
            id: "stock_availability"
        }].filter(f => {
            if (_.get(data, f.props.name) !== undefined) f.props.value = _.get(data, f.props.name);
            return f;
        });
    });

    return React.createElement(
        "div",
        { className: "product-edit-general border-block" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "strong",
                null,
                "General"
            )
        ),
        React.createElement(Area, { id: "product-edit-general", coreWidgets: fields })
    );
}