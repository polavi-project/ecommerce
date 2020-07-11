import {Form} from "../../../../../../../js/production/form/form.js"
import Area from "../../../../../../../js/production/area.js"
import Text from "../../../../../../../js/production/form/fields/text.js";
import {CountryOptions} from "../../../../../../../js/production/locale/country_option.js";
import Multiselect from "../../../../../../../js/production/form/fields/multiselect.js";
import Switch from "../../../../../../../js/production/form/fields/switch.js";

function Country({countries = []}) {
    return <div>
        <CountryOptions>
            <Multiselect
                value={countries}
                label="Applicable countries"
                name="shipment_flat_rate_countries[]"
            />
        </CountryOptions>
    </div>
}

export default function FlatRateSettingForm(props) {
    const [showForm, setShowForm] = React.useState(false);

    const onClick = (e) => {
        e.preventDefault();
        setShowForm(!showForm);
    };

    return <div className="col-4">
        <div className="sml-block">
            <div className="sml-block-title sml-flex-space-between mb-0">
                <span className="normal-font font-weight-semi-bold">Flat Rate</span>
                <a onClick={(e) => onClick(e)} href="#" className="text-primary normal-font">Edit</a>
            </div>
            <div style={{display: showForm ? 'block' : 'none'}} className="mt-4">
                <Form
                    id={"flat_rate-setting-form"}
                    {...props}>
                    <Area id="flat_rate-setting-form" coreWidgets={[
                        {
                            component: Text,
                            props : {id : 'shipment_flat_rate_name', value: _.get(props, 'shipment_flat_rate_name', ''), formId: "flat_rate-setting-form", name: "shipment_flat_rate_name", label: "Title", validation_rules:["notEmpty"]},
                            sort_order: 10,
                            id: "shipment_flat_rate_name"
                        },
                        {
                            component: Text,
                            props : {id : 'shipment_flat_rate_fee', value: _.get(props, 'shipment_flat_rate_fee', ''), formId: "flat_rate-setting-form", name: "shipment_flat_rate_fee", label: "Shipping fee", validation_rules:["notEmpty"]},
                            sort_order: 20,
                            id: "shipment_flat_rate_fee"
                        },
                        {
                            component: Switch,
                            props : {id : 'shipment_flat_rate_status', value: _.get(props, 'shipment_flat_rate_status', ''), formId: "flat_rate-setting-form", name: "shipment_flat_rate_status", label: "Status", isTranslateAble:false},
                            sort_order: 30,
                            id: "shipment_flat_rate_status"
                        },
                        {
                            component: Country,
                            props : {id : 'shipment_flat_rate_countries', countries: _.get(props, 'shipment_flat_rate_countries', []), formId: "flat_rate-setting-form"},
                            sort_order: 40,
                            id: "shipment_flat_rate_countries"
                        },
                        {
                            component: Text,
                            props : {id : 'shipment_flat_rate_sort_order', value: _.get(props, 'shipment_flat_rate_sort_order', ''), formId: "flat_rate-setting-form", name: "shipment_flat_rate_sort_order", label: "Sort order"},
                            sort_order: 50,
                            id: "shipment_flat_rate_sort_order"
                        }
                    ]}/>
                </Form>
            </div>
        </div>
    </div>
}