import Text from "../../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../../js/production/form/fields/select.js";

export default function ShippingAddress({addresses, fields, formId}) {
    return <div>
        <p>Shipping address</p>
        {
            addresses &&
            <div>
                <p>Select your address</p>
                <Select
                    name={"selected_shipping_address"}
                    options={addresses.map((a) => {

                    })}
                />
            </div>
        }
        <div>
            {
                fields.map((f,i) => {
                    let Fc = "";
                    switch (f.type) {
                        case "text":
                            Fc = <Text
                                id={f.id}
                                formId={formId}
                                name={f.name}
                                validation_rules={f.validation_rules ? f.validation_rules : []}
                            />;
                            break;
                        case "select":
                            Fc = <Select
                                id={f.id}
                                formId={formId}
                                name={f.name}
                                options={f.options}
                                validation_rules={f.validation_rules ? f.validation_rules : []}
                            />;
                            break;
                        default:
                            Fc = <Text
                                formId={formId}
                                name={f.name}
                                validation_rules={f.validation_rules ? f.validation_rules : []}
                            />;
                    }
                    return <div>
                        <label htmlFor={f.id}>{f.label}</label>
                        {Fc}
                    </div>
                })
            }
        </div>
    </div>
}