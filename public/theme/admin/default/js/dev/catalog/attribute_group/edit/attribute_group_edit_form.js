import {Form} from "../../../../../../../../js/production/form/form.js"
import Area from "../../../../../../../../js/production/area.js"
import Text from "../../../../../../../../js/production/form/fields/text.js";
import A from "../../../../../../../../js/production/a.js";
import Checkbox from "../../../../../../../../js/production/form/fields/checkbox.js";

function Attributes({_attributes = [], _selectedAttributes = []})
{
    return <div className="attribute-group-edit-attributes">
        <div className="group-form-title"><h5>Attributes</h5></div>
        <ul className="list-unstyled">
            {_attributes.map((a) => {
                let {attribute_id, attribute_name} = a;
                return <li key={attribute_id}>
                    <Checkbox
                        className="uk-checkbox"
                        label={attribute_name}
                        type={"checkbox"}
                        name={'attributes[' + attribute_id + ']'}
                        value={attribute_id}
                        isChecked={_selectedAttributes.findIndex((e) => { return parseInt(e.attribute_id) === parseInt(attribute_id); })!== -1}
                    />
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
        <Form id={"attribute-group-edit-form"} {...props} submitText={null}>
            <div className="form-head sticky">
                <div className="child-align-middle">
                    <A url={props.listUrl} className="">
                        <i className="fas fa-arrow-left"></i>
                        <span className="pl-1">Attribute group list</span>
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
                        <Area id="admin_attribute_group_edit_inner_left"
                              coreWidgets={fields}
                        />
                    </div>
                    <div className="col-6"><Attributes _attributes={_.get(props, 'attributes', [])} _selectedAttributes={_.get(props, 'group.attributes', [])}/></div>
                </div>
            </div>
        </Form>
        <Area id="admin_attribute_group_edit_after" widgets={[]}/>
    </div>
}