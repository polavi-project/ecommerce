var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Form } from "../../../../../../../../js/production/form/form.js";
import Area from "../../../../../../../../js/production/area.js";
import Text from "../../../../../../../../js/production/form/fields/text.js";
import A from "../../../../../../../../js/production/a.js";

function Attributes({ _attributes = [], _selectedAttributes = [] }) {
    return React.createElement(
        "div",
        { className: "attribute-group-edit-attributes" },
        React.createElement(
            "div",
            { className: "group-form-title" },
            React.createElement(
                "h5",
                null,
                "Attributes"
            )
        ),
        React.createElement(
            "ul",
            { className: "list-unstyled" },
            _attributes.map(a => {
                let { attribute_id, attribute_name } = a;
                return React.createElement(
                    "li",
                    { key: attribute_id },
                    React.createElement(
                        "label",
                        null,
                        React.createElement("input", {
                            className: "uk-checkbox",
                            type: "checkbox",
                            name: 'attributes[' + attribute_id + ']',
                            value: attribute_id,
                            defaultChecked: _selectedAttributes.findIndex(e => {
                                return parseInt(e.attribute_id) === parseInt(attribute_id);
                            }) !== -1
                        }),
                        React.createElement(
                            "span",
                            null,
                            " " + attribute_name
                        )
                    )
                );
            })
        )
    );
}

export default function AttributeGroupEditForm(props) {
    let [fields, setFields] = React.useState([{
        component: Text,
        props: { id: 'group_name', formId: "attribute-group-edit-form", name: "group_name", value: _.get(props, 'group.group_name', ''), label: "Name", validation_rules: ["notEmpty"] },
        sort_order: 10,
        id: "group_name"
    }]);

    return React.createElement(
        "div",
        { className: "attribute-group-edit-container" },
        React.createElement(Area, { id: "admin_attribute_group_edit_before", widgets: [] }),
        React.createElement(
            Form,
            _extends({ id: "attribute-group-edit-form" }, props, { submitText: null }),
            React.createElement(
                "div",
                { className: "form-head sticky" },
                React.createElement(
                    "div",
                    { className: "child-align-middle" },
                    React.createElement(
                        A,
                        { url: props.listUrl, className: "" },
                        React.createElement("i", { className: "fas fa-arrow-left" }),
                        React.createElement(
                            "span",
                            { className: "pl-1" },
                            "Attribute group list"
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "buttons" },
                    React.createElement(
                        A,
                        { className: "btn btn-danger", url: props.cancelUrl },
                        "Cancel"
                    ),
                    React.createElement(
                        "button",
                        { type: "submit", className: "btn btn-primary" },
                        "Submit"
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "sml-block" },
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "div",
                        { className: "col-6" },
                        React.createElement(Area, { id: "admin_attribute_group_edit_inner_left",
                            coreWidgets: fields
                        })
                    ),
                    React.createElement(
                        "div",
                        { className: "col-6" },
                        React.createElement(Attributes, { _attributes: _.get(props, 'attributes', []), _selectedAttributes: _.get(props, 'group.attributes', []) })
                    )
                )
            )
        ),
        React.createElement(Area, { id: "admin_attribute_group_edit_after", widgets: [] })
    );
}