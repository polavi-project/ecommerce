import {Form} from "../../../../../../../../js/production/form/form.js"
import Area from "../../../../../../../../js/production/area.js"
import Text from "../../../../../../../../js/production/form/fields/text.js";
import Checkbox from "../../../../../../../../js/production/form/fields/checkbox.js";

function Attributes({_attributes = [], _selectedAttributes = []})
{
    return <div className="attribute-group-edit-attributes">
        <div className="group-form-title"><strong>Attributes</strong></div>
        <ul className="uk-list">
            {_attributes.map((a) => {
                let {attribute_id, attribute_name} = a;
                return <li key={attribute_id}>
                    <label>
                        <input
                            className="uk-checkbox"
                            type={"checkbox"}
                            name={'attributes[' + attribute_id + ']'}
                            value={attribute_id}
                            defaultChecked={_selectedAttributes.findIndex((e) => { return parseInt(e.attribute_id) === parseInt(attribute_id); })!== -1}
                        />
                        <span>{" " + attribute_name}</span>
                    </label>
                </li>
            })}
        </ul>
    </div>;
}

export default function AttributeGroupEditForm(props) {
    let [fields, setFields] = React.useState([
        {
            component: Text,
            props : {id : 'group_name', formId: "attribute-group-edit-form", name: "group_name", value: _.get(props, 'group.group_name', ''), label: "Name", validation_rules:["notEmpty"]},
            sort_order: 10,
            id: "group_name"
        }
    ]);

    return <div className="attribute-group-edit-container">
        <Area id="admin_attribute_group_edit_before" widgets={[]}/>
        <Form id={"attribute-group-edit-form"} {...props}>
            <div className="uk-grid uk-grid-small">
                <div className="uk-width-1-2">
                    <Area id="admin_attribute_group_edit_inner_left"
                          coreWidgets={fields}
                    />
                </div>
                <div className="uk-width-1-2"><Attributes _attributes={_.get(props, 'attributes', [])} _selectedAttributes={_.get(props, 'group.attributes', [])}/></div>
            </div>
        </Form>
        <Area id="admin_attribute_group_edit_after" widgets={[]}/>
    </div>
}