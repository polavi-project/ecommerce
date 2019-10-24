import {Form} from "../../../../../../../../js/production/form/form.js"
import Area from "../../../../../../../../js/production/area.js"
import Text from "../../../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../../../js/production/form/fields/select.js";

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
        <div className="group-form-title"><strong>Options</strong></div>
            <table className="uk-table uk-table-small">
                <thead>
                    <tr>
                        <td>Value</td>
                        <td>--</td>
                    </tr>
                </thead>
                <tbody>
                {options.map((option, index) => {
                    let {attribute_option_id, option_text} = option;
                    return <tr key={index}>
                        <td>
                            <Text name={'options[' + attribute_option_id + '][option_text]'} formId={"attribute-edit-form"} value={option_text} validation_rules={['notEmpty']}/>
                        </td>
                        <td><a href="#" onClick={(e) => removeOption(index, e)}><span uk-icon="minus-circle"></span></a></td>
                    </tr>
                })}
                </tbody>
            </table>
        <div><a href="#" onClick={(e) => addOption(e)}><span uk-icon="plus-circle"></span></a></div>
    </div>;
}

let fields = [
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
        props : {id : 'type', formId: "attribute-edit-form", name: "type", label: "Type", options:[{value: 'text', text: 'Text'}, {value:'textarea', text: 'Textarea'}, {value:'select', text: 'Select'}, {value:'multiselect', text: 'Multi select'}, {value:'date', text: 'Date'}]},
        sort_order: 30,
        id: "type"
    },
    {
        component: Select,
        props : {id : "is_required", formId: "attribute-edit-form", name: "is_required", label: "Is required?", options:[{value:0, text:'No'}, {value:1, text:'Yes'}]},
        sort_order: 40,
        id: "is_required"
    },
    {
        component: Select,
        props : {id : "display_on_frontend", formId: "attribute-edit-form", name: "display_on_frontend", label: "Show to customer?", options:[{value:0, text:'No'}, {value:1, text:'Yes'}]},
        sort_order: 50,
        id: "display_on_frontend"
    },
    {
        component: Text,
        props : {id : "sort_order", formId: "attribute-edit-form", name: "sort_order", type: "text", label: "Sort order", validation_rules:["integer"]},
        sort_order: 60,
        id: "sort_order"
    }
];

export default function AttributeEditForm(props) {

    const [type, setType] = React.useState(_.get(props, 'attribute.type', null));

    React.useState(function() {
        fields.filter((f) => {
            if(_.get(props, `attribute.${f.props.name}`) !== undefined)
                f.props.value = _.get(props, `attribute.${f.props.name}`);
            return f;
        });
        return null
    }, []);

    return <div className="attribute-edit-container">
        <Area id="admin_attribute_edit_before" widgets={[]}/>
        <Form id={"attribute-edit-form"} {...props}>
            <div className="uk-grid uk-grid-small">
                <div className="uk-width-1-2">
                    <Area id="admin_attribute_edit_inner_left"
                          setType={setType}
                          coreWidgets={fields}
                    />
                </div>
                {(type == 'select' || type == 'multiselect') && <div className="uk-width-1-2"><Options _options={_.get(props, 'attribute.options', [])}/></div>}
            </div>
        </Form>
        <Area id="admin_attribute_edit_after" widgets={[]}/>
    </div>
}