import Text from "../../../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../../../js/production/form/fields/select.js";
import Date from "../../../../../../../../js/production/form/fields/date.js";
import Datetime from "../../../../../../../../js/production/form/fields/datetime.js";
import Textarea from "../../../../../../../../js/production/form/fields/textarea.js";
import Multiselect from "../../../../../../../../js/production/form/fields/multiselect.js";

export default function Attributes(props) {
    const [attributes, setAttributes] = React.useState(() => {
        let value_index = props.product_attribute_index === undefined ? [] : props.product_attribute_index;
        let attributes = props.selected_group === undefined ? props.attributeGroups[0]['attributes'] : props.attributeGroups.find(a => parseInt(a.attribute_group_id) === parseInt(props.selected_group))['attributes'];
        return attributes.map((a, i) => {
            a['selected_option'] = '';
            a['value_text'] = '';
            value_index.forEach(function (v) {
                if (parseInt(v['attribute_id']) === parseInt(a['attribute_id'])) {
                    a['selected_option'] = v['option_id'];
                    a['value_text'] = v['attribute_value_text'];
                }
            });

            return a;
        });
    });

    return React.createElement(
        "div",
        { className: "product-edit-attribute uk-width-1-2" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "strong",
                null,
                "Attribute"
            )
        ),
        React.createElement(
            "div",
            null,
            React.createElement(
                "span",
                null,
                "Attribute Group"
            ),
            React.createElement("br", null),
            React.createElement(Select, {
                name: "group_id",
                formId: props.formId,
                isTranslateAble: false,
                value: props.selected_group === undefined ? parseInt(props.attributeGroups[0]['attribute_group_id']) : parseInt(props.selected_group),
                handler: e => {
                    let value_index = props.product_attribute_index === undefined ? [] : props.product_attribute_index;
                    let attributes = props.attributeGroups.find(a => parseInt(a.attribute_group_id) === parseInt(e.target.value))['attributes'];
                    setAttributes(attributes.map((a, i) => {
                        a['selected_option'] = '';
                        a['value_text'] = '';
                        value_index.forEach(function (v) {
                            if (parseInt(v['attribute_id']) === parseInt(e['attribute_id'])) {
                                a['selected_option'] = v['option_id'];
                                a['value_text'] = v['attribute_value_text'];
                            }
                        });

                        return a;
                    }));
                },
                options: (() => {
                    return props.attributeGroups.map((g, i) => {
                        return { value: parseInt(g.attribute_group_id), text: g.group_name };
                    });
                })()
            })
        ),
        React.createElement(
            "table",
            { className: "uk-table uk-table-small" },
            React.createElement(
                "tbody",
                null,
                attributes.map((attribute, index) => {
                    let field = null;
                    switch (attribute.type) {
                        case 'text':
                            field = React.createElement(Text, {
                                name: 'attribute[' + attribute.attribute_code + ']',
                                formId: props.formId,
                                value: attribute.value_text,
                                validation_rules: parseInt(attribute.is_required) === 1 ? ['notEmpty'] : []
                            });
                            break;
                        case 'date':
                            field = React.createElement(Date, {
                                name: 'attribute[' + attribute.attribute_code + ']',
                                formId: props.formId,
                                value: attribute.value_text,
                                validation_rules: parseInt(attribute.is_required) === 1 ? ['notEmpty'] : []
                            });
                            break;
                        case 'datetime':
                            field = React.createElement(Datetime, {
                                name: 'attribute[' + attribute.attribute_code + ']',
                                formId: props.formId,
                                value: attribute.value_text,
                                validation_rules: parseInt(attribute.is_required) === 1 ? ['notEmpty'] : []
                            });
                            break;
                        case 'textarea':
                            field = React.createElement(Textarea, {
                                name: 'attribute[' + attribute.attribute_code + ']',
                                formId: props.formId,
                                value: attribute.value_text,
                                validation_rules: parseInt(attribute.is_required) === 1 ? ['notEmpty'] : []
                            });
                            break;
                        case 'select':
                            field = React.createElement(Select, {
                                name: 'attribute[' + attribute.attribute_code + ']',
                                formId: props.formId,
                                value: attribute.selected_option,
                                options: (() => {
                                    return attribute.options.map((o, i) => {
                                        return { value: o.option_id, text: o.option_text };
                                    });
                                })(),
                                validation_rules: parseInt(attribute.is_required) === 1 ? ['notEmpty'] : [],
                                isTranslateAble: false
                            });
                            break;
                        case 'multiselect':
                            field = React.createElement(Multiselect, {
                                name: 'attribute[' + attribute.attribute_code + ']',
                                formId: props.formId,
                                value: attribute.selected_option,
                                options: (() => {
                                    return attribute.options.map((o, i) => {
                                        return { value: o.option_id, text: o.option_text };
                                    });
                                })(),
                                validation_rules: parseInt(attribute.is_required) === 1 ? ['notEmpty'] : [],
                                isTranslateAble: false
                            });
                            break;
                        default:
                            field = React.createElement(Text, {
                                name: 'attribute[' + attribute.attribute_code + ']',
                                formId: props.formId,
                                value: attribute.value_text,
                                validation_rules: parseInt(attribute.is_required) === 1 ? ['notEmpty'] : []
                            });
                    }
                    return React.createElement(
                        "tr",
                        { key: index },
                        React.createElement(
                            "td",
                            null,
                            attribute.attribute_name
                        ),
                        React.createElement(
                            "td",
                            null,
                            field
                        )
                    );
                })
            )
        )
    );
}