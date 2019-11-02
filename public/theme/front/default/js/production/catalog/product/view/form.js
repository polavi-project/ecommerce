import { Form } from "../../../../../../../../js/production/form/form.js";
import Text from "../../../../../../../../js/production/form/fields/text.js";
import Options from "./options.js";
import Area from "../../../../../../../../js/production/area.js";

export default function ProductForm(props) {
    return React.createElement(
        Form,
        { id: "product-form", action: props.action, method: "POST", submitText: "Add to cart" },
        React.createElement("input", { type: "hidden", name: "product_id", value: props.productId }),
        React.createElement(Area, {
            id: "product_single_page_form",
            coreWidgets: [{
                'component': Options,
                'props': {
                    options: props.customOptions ? props.customOptions : []
                },
                'sort_order': 10,
                'id': 'product-single-custom-options'
            }, {
                'component': Text,
                'props': {
                    formId: "product-form",
                    name: "qty",
                    value: "",
                    validation_rules: ['notEmpty', 'number'],
                    label: "Quantity"
                },
                'sort_order': 20,
                'id': 'product-single-quantity'
            }]
        })
    );
}