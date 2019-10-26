import { Form } from "../../../../../../../../js/production/form/form.js";
import Text from "../../../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../../../js/production/form/fields/select.js";
import Multiselect from "../../../../../../../../js/production/form/fields/multiselect.js";

export default function ProductForm(props) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.orderData.language', 'en'));
    return React.createElement(
        Form,
        { id: "product-form", action: props.action, method: "POST", submitText: "Add to cart" },
        React.createElement("input", { type: "hidden", name: "product_id", value: props.productId }),
        props.customOptions.length > 0 && React.createElement(
            "div",
            null,
            React.createElement(
                "span",
                null,
                "Options"
            )
        ),
        props.customOptions.map((o, i) => {
            let values = o.values.map(v => {
                let _price = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(v.extra_price);
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
        })
    );
}