import Text from "../../../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../../../js/production/form/fields/select.js";
import Date from "../../../../../../../../js/production/form/fields/date.js";
import Datetime from "../../../../../../../../js/production/form/fields/datetime.js";
import Textarea from "../../../../../../../../js/production/form/fields/textarea.js";
import Multiselect from "../../../../../../../../js/production/form/fields/multiselect.js";
import {ADD_APP_STATE} from "../../../../../../../../js/production/event-types.js";

export default function Attributes(props) {
    const getAttributes = () => {
        let valueIndex = props.product_attribute_index === undefined ? [] : props.product_attribute_index;
        let attributes = props.selected_group === undefined ? props.attributeGroups[0]['attributes'] : props.attributeGroups.find((a)=> parseInt(a.attribute_group_id) === parseInt(props.selected_group))['attributes'];
        return attributes.map((a, i) => {
            a['selected_option'] = '';
            a['value_text'] = '';
            valueIndex.forEach(function(v) {
                if(parseInt(v['attribute_id']) === parseInt(a['attribute_id'])) {
                    a['selected_option'] = v['option_id'];
                    a['value_text'] = v['attribute_value_text'];
                }
            });

            return a;
        });
    };

    const [attributeData, setAttributeData] = React.useState(() => {
        let group = props.selected_group === undefined ? props.attributeGroups[0] : props.attributeGroups.find((a)=> parseInt(a.attribute_group_id) === parseInt(props.selected_group));
        group.attributes = getAttributes();

        return group;
    });

    const dispatch = ReactRedux.useDispatch();

    React.useEffect(() => {
        dispatch({'type': ADD_APP_STATE, 'payload': {appState: {attributeGroup: {...attributeData}}}});
    });

    return (
        <div className="product-edit-attribute sml-block">
            <div className="sml-block-title">Attribute</div>
            <div>
                <Select
                    name="group_id"
                    label={"Attribute groups"}
                    formId={props.formId}
                    isTranslateAble={false}
                    value={props.selected_group === undefined ? parseInt(props.attributeGroups[0]['attribute_group_id']) : parseInt(props.selected_group)}
                    handler={(e)=> {
                        let valueIndex = props.product_attribute_index === undefined ? [] : props.product_attribute_index;
                        setAttributeData((()=> {
                            let group = {...attributeData};
                            group.attribute_group_id = e.target.value;
                            group.group_name = e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text;
                            group.attributes = props.attributeGroups.find((a)=> parseInt(a.attribute_group_id) === parseInt(e.target.value))['attributes'].map((a, i) => {
                                a['selected_option'] = '';
                                a['value_text'] = '';
                                valueIndex.forEach(function(v) {
                                    if(parseInt(v['attribute_id']) === parseInt(a['attribute_id'])) {
                                        if(['select', 'multiselect'].includes(a.type))
                                            a['selected_option'] = v['option_id'];
                                        else
                                            a['value_text'] = v['attribute_value_text'];
                                    }
                                });

                                return a;
                            });

                            return group;
                        })());
                    }}
                    options={(()=>{
                        return props.attributeGroups.map((g,i)=> { return {value: parseInt(g.attribute_group_id), text: g.group_name}})
                    })()}
                />
            </div>
            <table className="table table-bordered">
                <tbody>
                {attributeData.attributes.map((attribute, index)=> {
                    let field = null;
                    switch (attribute.type) {
                        case 'text':
                            field = <Text
                                name={'attribute[' + attribute.attribute_code + ']'}
                                formId="product-edit-form"
                                value={attribute.value_text}
                                validation_rules={parseInt(attribute.is_required) === 1 ? ['notEmpty'] : []}
                            />;
                            break;
                        case 'date':
                            field = <Date
                                name={'attribute[' + attribute.attribute_code + ']'}
                                formId="product-edit-form"
                                value={attribute.value_text}
                                validation_rules={parseInt(attribute.is_required) === 1 ? ['notEmpty'] : []}
                            />;
                            break;
                        case 'datetime':
                            field = <Datetime
                                name={'attribute[' + attribute.attribute_code + ']'}
                                formId="product-edit-form"
                                value={attribute.value_text}
                                validation_rules={parseInt(attribute.is_required) === 1 ? ['notEmpty'] : []}
                            />;
                            break;
                        case 'textarea':
                            field = <Textarea
                                name={'attribute[' + attribute.attribute_code + ']'}
                                formId="product-edit-form"
                                value={attribute.value_text}
                                validation_rules={parseInt(attribute.is_required) === 1 ? ['notEmpty'] : []}
                            />;
                            break;
                        case 'select':
                            field = <Select
                                name={'attribute[' + attribute.attribute_code + ']'}
                                formId="product-edit-form"
                                value={attribute.selected_option}
                                options={(()=> {
                                    return attribute.options.map((o, i)=> { return {value: o.option_id, text: o.option_text}})
                                })()}
                                validation_rules={parseInt(attribute.is_required) === 1 ? ['notEmpty'] : []}
                                isTranslateAble={false}
                                handler={(e)=> {
                                    setAttributeData((()=> {
                                        let group = {...attributeData};
                                        group.attributes = attributeData.attributes.map((a, i) => {
                                            if(parseInt(a['attribute_id']) === parseInt(attribute['attribute_id'])) {
                                                a['selected_option'] = e.target.value;
                                                a['value_text'] = e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text;
                                            }

                                            return a;
                                        });

                                        return group;
                                    })());
                                }}
                            />;
                            break;
                        case 'multiselect':
                            field = <Multiselect
                                name={'attribute[' + attribute.attribute_code + ']'}
                                formId="product-edit-form"
                                value={attribute.selected_option}
                                options={(()=> {
                                    return attribute.options.map((o, i)=> { return {value: o.option_id, text: o.option_text}})
                                })()}
                                validation_rules={parseInt(attribute.is_required) === 1 ? ['notEmpty'] : []}
                                isTranslateAble={false}
                            />;
                            break;
                        default:
                            field = <Text
                                name={'attribute[' + attribute.attribute_code + ']'}
                                formId="product-edit-form"
                                value={attribute.value_text}
                                validation_rules={parseInt(attribute.is_required) === 1 ? ['notEmpty'] : []}
                            />;
                    }
                    return <tr key={attribute.attribute_code}>
                        <td>
                            {attribute.attribute_name}
                        </td>
                        <td>
                            {field}
                        </td>
                    </tr>
                })}
                </tbody>
            </table>
        </div>
    );
}