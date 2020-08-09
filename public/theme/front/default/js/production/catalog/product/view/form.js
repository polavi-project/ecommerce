import { Form } from "../../../../../../../../js/production/form/form.js";
import Text from "../../../../../../../../js/production/form/fields/text.js";
import Options from "./options.js";
import Area from "../../../../../../../../js/production/area.js";

function AddToCart() {
    return React.createElement(
        "div",
        { className: "add-to-cart d-flex" },
        React.createElement(Text, { validation_rules: ['notEmpty', 'number'], name: "qty", placeholder: "Qty", formId: "product-form" }),
        React.createElement(
            "div",
            { className: "button" },
            React.createElement(
                "a",
                { className: "btn btn-primary", href: "#", onClick: e => {
                        e.preventDefault();document.getElementById('product-form').dispatchEvent(new Event('submit'));
                    } },
                "Add to cart"
            )
        )
    );
}

export default function ProductForm(props) {
    return React.createElement(
        Form,
        { id: "product-form", action: props.action, method: "POST", submitText: null },
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
                'component': AddToCart,
                'props': {},
                'sort_order': 50,
                'id': 'product-single-add-cart'
            }]
        })
    );
}