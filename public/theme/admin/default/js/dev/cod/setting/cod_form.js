import {Form} from "../../../../../../../js/production/form/form.js"
import Area from "../../../../../../../js/production/area.js"
import Text from "../../../../../../../js/production/form/fields/text.js";
import Switch from "../../../../../../../js/production/form/fields/switch.js";

export default function CodSettingForm(props) {

    const [showForm, setShowForm] = React.useState(false);
    const onClick = (e) => {
        e.preventDefault();
        setShowForm(!showForm);
    };

    return <div className="col-4">
        <div className="sml-block">
            <div className="sml-block-title sml-flex-space-between mb-0">
                <span className="normal-font font-weight-semi-bold">Cash on delivery</span>
                <a onClick={(e) => onClick(e)} href="#" className="text-primary normal-font">Edit</a>
            </div>
            <div style={{display: showForm ? 'block' : 'none'}} className="mt-4">
                <Form
                    id={"cod-setting-form"}
                    {...props}>
                    <Area id="cod-setting-form" coreWidgets={[
                        {
                            component: Text,
                            props : {id : 'payment_cod_name', value: _.get(props, 'payment_cod_name', ''), formId: "cod-setting-form", name: "payment_cod_name", label: "Title", validation_rules:["notEmpty"]},
                            sort_order: 10,
                            id: "payment_cod_name"
                        },
                        {
                            component: Switch,
                            props : {id : 'payment_cod_status', value: _.get(props, 'payment_cod_status', ''), formId: "cod-setting-form", name: "payment_cod_status", type: "select", label: "Status", isTranslateAble:false},
                            sort_order: 20,
                            id: "payment_cod_status"
                        },
                        {
                            component: Text,
                            props : {id : 'payment_cod_minimum', value: _.get(props, 'payment_cod_minimum', ''), formId: "cod-setting-form", name: "payment_cod_minimum", label: "Minimum order total"},
                            sort_order: 30,
                            id: "payment_cod_minimum"
                        },
                        {
                            component: Text,
                            props : {id : 'payment_cod_maximum', value: _.get(props, 'payment_cod_maximum', ''), formId: "cod-setting-form", name: "payment_cod_maximum", label: "Maximum order total"},
                            sort_order: 40,
                            id: "payment_cod_maximum"
                        },
                        {
                            component: Text,
                            props : {id : 'payment_cod_sort_order', value: _.get(props, 'payment_cod_sort_order', ''), formId: "cod-setting-form", name: "payment_cod_sort_order", label: "Sort order"},
                            sort_order: 50,
                            id: "payment_cod_sort_order"
                        }
                    ]}/>
                </Form>
            </div>
        </div>
    </div>
}