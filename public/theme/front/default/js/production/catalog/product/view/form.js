import { Form } from "../../../../../../../../js/production/form/form.js";
import Text from "../../../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../../../js/production/form/fields/select.js";
import Multiselect from "../../../../../../../../js/production/form/fields/multiselect.js";

export default function ProductForm({ productId, customOptions }) {
    return React.createElement(
        Form,
        { id: "product-form", action: window.base_url + "/cart/add", method: "POST" },
        React.createElement("input", { type: "hidden", name: "product_id", value: productId }),
        customOptions && React.createElement(
            "div",
            null,
            React.createElement(
                "span",
                null,
                "Options"
            )
        ),
        customOptions.map((o, i) => {
            let values = o.values.map(v => {
                let _price = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(v.extra_price);
                return {
                    value: v.value_id,
                    text: v.value + ` (+ ${_price})`
                };
            });
            let FieldComponent = "";
            switch (o.option_type) {
                case "select":
                    FieldComponent = React.createElement(Select, {
                        key: i,
                        name: `custom_options[${o.option_id}]`,
                        options: values,
                        validation_rules: parseInt(o.is_required) === 1 ? ['notEmpty'] : [],
                        formId: "product-form",
                        label: o.option_name
                    });
                    break;
                case "multiselect":
                    FieldComponent = React.createElement(Multiselect, {
                        key: i,
                        name: `custom_options[${o.option_id}]`,
                        options: values,
                        validation_rules: parseInt(o.is_required) === 1 ? ['notEmpty'] : [],
                        formId: "product-form",
                        label: o.option_name
                    });
                    break;
                default:
                    FieldComponent = React.createElement(Select, {
                        key: i,
                        name: `custom_options[${o.option_id}]`,
                        options: values,
                        validation_rules: parseInt(o.is_required) === 1 ? ['notEmpty'] : [],
                        formId: "product-form",
                        label: o.option_name
                    });
            }
            return FieldComponent;
        }),
        React.createElement(Text, {
            formId: "product-form",
            name: "qty",
            value: "",
            validation_rules: ['notEmpty'],
            label: "Quantity"
        }),
        React.createElement(
            "button",
            { type: "submit", className: "uk-button uk-button-primary" },
            React.createElement(
                "span",
                null,
                "Add To Cart"
            )
        )
    );
}