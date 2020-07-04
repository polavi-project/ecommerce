import {Form} from "../../../../../../../../js/production/form/form.js"
import Area from "../../../../../../../../js/production/area.js"
import Text from "../../../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../../../js/production/form/fields/select.js";
import Switch from "../../../../../../../../js/production/form/fields/switch.js";
import A from "../../../../../../../../js/production/a.js";

function Type(props) {
    const changeType = (e) => {
        props.areaProps.setType(e.target.value)
    };
    return <Select
        {...props}
        handler={changeType}
    />
}

function Options({_options = []})
{
    const [options, setOptions] = React.useState(_options);

    const addOption = (e) => {
        e.preventDefault();
        setOptions(options.concat({
            attribute_option_id: Date.now(),
            option_text: ""
        }));
    };

    const removeOption = (key, e) => {
        e.preventDefault();
        const newOptions = options.filter((_, index) => index !== key);
        setOptions(newOptions);
    };

    return <div className="attribute-edit-options">
        <div className="group-form-title"><h5>Options</h5></div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <td>Value</td>
                        <td>--</td>
                    </tr>
                </thead>
                <tbody>
                {options.map((option, index) => {
                    let {attribute_option_id, option_text} = option;
                    return <tr key={attribute_option_id}>
                        <td>
                            <Text name={'options[' + attribute_option_id + '][option_text]'} formId={"attribute-edit-form"} value={option_text} validation_rules={['notEmpty']}/>
                        </td>
                        <td><a href="#" onClick={(e) => removeOption(index, e)}><i className="fas fa-trash-alt"></i></a></td>
                    </tr>
                })}
                </tbody>
            </table>
        <div><a href="#" onClick={(e) => addOption(e)}><i className="fas fa-plus-circle"></i></a></div>
    </div>;
}

export default function AttributeEditForm(props) {
    let [fields, setFields] = React.useState(() => {
        return [
            {
                component: Text,
                props : {id : 'attribute_name', formId: "attribute-edit-form", name: "attribute_name", label: "Name", validation_rules:["notEmpty"]},
                sort_order: 10,
                id: "attribute_name"
            },
            {
                component: Text,
                props : {id : 'attribute_code', formId: "attribute-edit-form", name: "attribute_code", label: "Code", validation_rules:["notEmpty"]},
                sort_order: 20,
                id: "attribute_code"
            },
            {
                component: Type,
                props : {id : 'type', formId: "attribute-edit-form", name: "type", label: "Type", options:[{value: 'text', text: 'Text'}, {value:'textarea', text: 'Textarea'}, {value:'select', text: 'Select'}, {value:'multiselect', text: 'Multi select'}, {value:'date', text: 'Date'}], validation_rules:["notEmpty"]},
                sort_order: 30,
                id: "type"
            },
            {
                component: Switch,
                props : {id : "is_required", formId: "attribute-edit-form", name: "is_required", label: "Is required?"},
                sort_order: 40,
                id: "is_required"
            },
            {
                component: Switch,
                props : {id : "display_on_frontend", formId: "attribute-edit-form", name: "display_on_frontend", label: "Show to customer?"},
                sort_order: 50,
                id: "display_on_frontend"
            },
            {
                component: Switch,
                props : {id : "is_filterable", formId: "attribute-edit-form", name: "is_filterable", label: "Filterable?"},
                sort_order: 55,
                id: "is_filterable"
            },
            {
                component: Text,
                props : {id : "sort_order", formId: "attribute-edit-form", name: "sort_order", type: "text", label: "Sort order", validation_rules:["integer"]},
                sort_order: 60,
                id: "sort_order"
            }
        ].filter((f) => {
            if(_.get(props, `attribute.${f.props.name}`) !== undefined)
                f.props.value = _.get(props, `attribute.${f.props.name}`);
            return f;
        });
    });

    const [type, setType] = React.useState(_.get(props, 'attribute.type', null));

    return <div className="attribute-edit-container">
        <Area id="admin_attribute_edit_before" widgets={[]}/>
        <Form id={"attribute-edit-form"} {...props} submitText={null}>
            <div className="form-head sticky">
                <div className="child-align-middle">
                    <A url={props.listUrl} className="">
                        <i className="fas fa-arrow-left"></i>
                        <span className="pl-1">Attribute list</span>
                    </A>
                </div>
                <div className="buttons">
                    <A className="btn btn-danger" url={props.cancelUrl}>Cancel</A>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </div>
            <div className="sml-block">
                <div className="row">
                    <div className="col-6">
                        <Area id="admin_attribute_edit_inner_left"
                              setType={setType}
                              coreWidgets={fields}
                        />
                    </div>
                    {(type == 'select' || type == 'multiselect') && <div className="col-6"><Options _options={_.get(props, 'attribute.options', [])}/></div>}
                </div>
            </div>
        </Form>
        <Area id="admin_attribute_edit_after" widgets={[]}/>
    </div>
}