import Area from "../../../../../../../../js/production/area.js";
import Text from "../../../../../../../../js/production/form/fields/text.js";
import Switch from "../../../../../../../../js/production/form/fields/switch.js";

export default function Inventory({ data }) {
    const [fields] = React.useState(() => {
        return [{
            component: Switch,
            props: { id: "manage_stock", formId: "product-edit-form", name: "manage_stock", label: "Manage stock?", options: [{ value: 0, text: 'No' }, { value: 1, text: 'Yes' }], isTranslateAble: false },
            sort_order: 10,
            id: "manage_stock"
        }, {
            component: Text,
            props: { id: "qty", formId: "product-edit-form", name: "qty", type: "text", label: "Quantity", validation_rules: ["notEmpty", "integer"], isTranslateAble: false },
            sort_order: 20,
            id: "qty"
        }, {
            component: Switch,
            props: { id: "stock_availability", formId: "product-edit-form", name: "stock_availability", label: "Stock availability", options: [{ value: 0, text: 'Out of stock' }, { value: 1, text: 'In stock' }], validation_rules: ["notEmpty"], isTranslateAble: false },
            sort_order: 30,
            id: "stock_availability"
        }].filter(f => {
            if (_.get(data, f.props.name) !== undefined) f.props.value = _.get(data, f.props.name);
            return f;
        });
    });

    return React.createElement(
        "div",
        { className: "product-edit-inventory sml-block mt-4" },
        React.createElement(
            "div",
            { className: "sml-block-title" },
            "Inventory"
        ),
        React.createElement(Area, { id: "product-edit-inventory", coreWidgets: fields })
    );
}