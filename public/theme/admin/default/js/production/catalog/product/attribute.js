var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

export default class Attribute extends React.Component {
    constructor(props) {
        super(props);
        let attributes = this.props.attribute_groups[0].attributes === undefined ? [] : this.props.attribute_groups[0].attributes;
        if (this.props.group_id !== undefined) {
            let group = this.props.attribute_groups.find(f => {
                return parseInt(f.value) === parseInt(this.props.group_id);
            });
            attributes = group.attributes === undefined ? [] : group.attributes;
        }
        this.state = {
            attributes
        };
    }

    changeAttributeGroup(event) {
        const group_id = event.target.value;
        let group = this.props.attribute_groups.find(f => {
            return f.value === group_id;
        });
        let attributes = group.attributes === undefined ? [] : group.attributes;
        this.setState(_extends({}, this.state, {
            attributes
        }));
    }

    changeAttributeValue(code, e) {
        let attributes = this.state.attributes;
        attributes = attributes.map(attr => {
            if (attr.attribute_code === code) {
                attr.selected_value = e.target.value;
            }
            return attr;
        });
        this.setState(_extends({}, this.state, {
            attributes
        }));
    }

    render() {
        return React.createElement(
            "div",
            { className: "group-form" },
            React.createElement(
                "div",
                { className: "group-form-title" },
                React.createElement(
                    "span",
                    null,
                    "Attributes"
                )
            ),
            React.createElement(
                "table",
                null,
                React.createElement(
                    "thead",
                    null,
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                "span",
                                null,
                                "Attribute Group"
                            ),
                            React.createElement("br", null),
                            React.createElement(
                                "select",
                                { name: "group_id", defaultValue: this.props.group_id, onChange: this.changeAttributeGroup.bind(this) },
                                this.props.attribute_groups.map((g, i) => React.createElement(
                                    "option",
                                    { key: i, value: g.value },
                                    g.text
                                ))
                            )
                        )
                    )
                ),
                React.createElement(
                    "tbody",
                    null,
                    this.state.attributes.map((attribute, index) => {
                        let field = null;
                        switch (attribute.type) {
                            case 'text':
                            case 'date':
                                field = React.createElement("input", { type: "text", name: 'attribute[' + attribute.attribute_code + ']', value: attribute.selected_value, onChange: e => this.changeAttributeValue(attribute.attribute_code, e) });
                                break;
                            case 'textarea':
                                field = React.createElement("textarea", { name: 'attribute[' + attribute.attribute_code + ']', value: attribute.selected_value, onChange: e => this.changeAttributeValue(attribute.attribute_code, e) });
                                break;
                            case 'select':
                                field = React.createElement(
                                    "select",
                                    { name: 'attribute[' + attribute.attribute_code + ']', value: attribute.selected_value, onChange: e => this.changeAttributeValue(attribute.attribute_code, e) },
                                    attribute.options.map((o, i) => React.createElement(
                                        "option",
                                        { key: i, value: o.attribute_option_id },
                                        o.option_text
                                    ))
                                );
                                break;
                            case 'multiselect':
                                field = React.createElement(
                                    "select",
                                    { multiple: "multiple", name: 'attribute[' + attribute.attribute_code + ']', value: attribute.selected_value, onChange: e => this.changeAttributeValue(attribute.attribute_code, e) },
                                    attribute.options.map((o, i) => {
                                        return React.createElement(
                                            "option",
                                            { key: i, value: o.attribute_option_id },
                                            o.option_text
                                        );
                                    })
                                );
                                break;
                            default:
                                field = React.createElement("input", { type: "text", name: 'attribute[' + attribute.attribute_code + ']', value: attribute.selected_value, onChange: e => this.changeAttributeValue(attribute.attribute_code, e) });
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
}