import Text from "../../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../../js/production/form/fields/select.js";

export default function ShippingAddress({ addresses, fields, formId }) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "p",
            null,
            "Shipping address"
        ),
        addresses && React.createElement(
            "div",
            null,
            React.createElement(
                "p",
                null,
                "Select your address"
            ),
            React.createElement(Select, {
                name: "selected_shipping_address",
                options: addresses.map(a => {})
            })
        ),
        React.createElement(
            "div",
            null,
            fields.map((f, i) => {
                let Fc = "";
                switch (f.type) {
                    case "text":
                        Fc = React.createElement(Text, {
                            id: f.id,
                            formId: formId,
                            name: f.name,
                            validation_rules: f.validation_rules ? f.validation_rules : []
                        });
                        break;
                    case "select":
                        Fc = React.createElement(Select, {
                            id: f.id,
                            formId: formId,
                            name: f.name,
                            options: f.options,
                            validation_rules: f.validation_rules ? f.validation_rules : []
                        });
                        break;
                    default:
                        Fc = React.createElement(Text, {
                            formId: formId,
                            name: f.name,
                            validation_rules: f.validation_rules ? f.validation_rules : []
                        });
                }
                return React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "label",
                        { htmlFor: f.id },
                        f.label
                    ),
                    Fc
                );
            })
        )
    );
}