var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Form } from "../../../../../../../../js/production/form/form.js";
import Area from "../../../../../../../../js/production/area.js";
import Text from "../../../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../../../js/production/form/fields/select.js";
import Switch from "../../../../../../../../js/production/form/fields/switch.js";
import A from "../../../../../../../../js/production/a.js";

function Type(props) {
    const changeType = e => {
        props.areaProps.setType(e.target.value);
    };
    return React.createElement(Select, _extends({}, props, {
        handler: changeType
    }));
}

function Options({ _options = [] }) {
    const [options, setOptions] = React.useState(_options);

    const addOption = e => {
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

    return React.createElement(
        "div",
        { className: "attribute-edit-options" },
        React.createElement(
            "div",
            { className: "group-form-title" },
            React.createElement(
                "h5",
                null,
                "Options"
            )
        ),
        React.createElement(
            "table",
            { className: "table table-bordered" },
            React.createElement(
                "thead",
                null,
                React.createElement(
                    "tr",
                    null,
                    React.createElement(
                        "td",
                        null,
                        "Value"
                    ),
                    React.createElement(
                        "td",
                        null,
                        "--"
                    )
                )
            ),
            React.createElement(
                "tbody",
                null,
                options.map((option, index) => {
                    let { attribute_option_id, option_text } = option;
                    return React.createElement(
                        "tr",
                        { key: attribute_option_id },
                        React.createElement(
                            "td",
                            null,
                            React.createElement(Text, { name: 'options[' + attribute_option_id + '][option_text]', formId: "attribute-edit-form", value: option_text, validation_rules: ['notEmpty'] })
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                "a",
                                { href: "#", onClick: e => removeOption(index, e) },
                                React.createElement("i", { className: "fas fa-trash-alt" })
                            )
                        )
                    );
                })
            )
        ),
        React.createElement(
            "div",
            null,
            React.createElement(
                "a",
                { href: "#", onClick: e => addOption(e) },
                React.createElement("i", { className: "fas fa-plus-circle" })
            )
        )
    );
}

export default function AttributeEditForm(props) {
    let [fields, setFields] = React.useState(() => {
        return [{
            component: Text,
            props: { id: 'attribute_name', formId: "attribute-edit-form", name: "attribute_name", label: "Name", validation_rules: ["notEmpty"] },
            sort_order: 10,
            id: "attribute_name"
        }, {
            component: Text,
            props: { id: 'attribute_code', formId: "attribute-edit-form", name: "attribute_code", label: "Code", validation_rules: ["notEmpty"] },
            sort_order: 20,
            id: "attribute_code"
        }, {
            component: Type,
            props: { id: 'type', formId: "attribute-edit-form", name: "type", label: "Type", options: [{ value: 'text', text: 'Text' }, { value: 'textarea', text: 'Textarea' }, { value: 'select', text: 'Select' }, { value: 'multiselect', text: 'Multi select' }, { value: 'date', text: 'Date' }], validation_rules: ["notEmpty"] },
            sort_order: 30,
            id: "type"
        }, {
            component: Switch,
            props: { id: "is_required", formId: "attribute-edit-form", name: "is_required", label: "Is required?" },
            sort_order: 40,
            id: "is_required"
        }, {
            component: Switch,
            props: { id: "display_on_frontend", formId: "attribute-edit-form", name: "display_on_frontend", label: "Show to customer?" },
            sort_order: 50,
            id: "display_on_frontend"
        }, {
            component: Switch,
            props: { id: "is_filterable", formId: "attribute-edit-form", name: "is_filterable", label: "Filterable?" },
            sort_order: 55,
            id: "is_filterable"
        }, {
            component: Text,
            props: { id: "sort_order", formId: "attribute-edit-form", name: "sort_order", type: "text", label: "Sort order", validation_rules: ["integer"] },
            sort_order: 60,
            id: "sort_order"
        }].filter(f => {
            if (_.get(props, `attribute.${f.props.name}`) !== undefined) f.props.value = _.get(props, `attribute.${f.props.name}`);
            return f;
        });
    });

    const [type, setType] = React.useState(_.get(props, 'attribute.type', null));

    return React.createElement(
        "div",
        { className: "attribute-edit-container" },
        React.createElement(Area, { id: "admin_attribute_edit_before", widgets: [] }),
        React.createElement(
            Form,
            _extends({ id: "attribute-edit-form" }, props, { submitText: null }),
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
                            "Attribute list"
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
                        React.createElement(Area, { id: "admin_attribute_edit_inner_left",
                            setType: setType,
                            coreWidgets: fields
                        })
                    ),
                    (type == 'select' || type == 'multiselect') && React.createElement(
                        "div",
                        { className: "col-6" },
                        React.createElement(Options, { _options: _.get(props, 'attribute.options', []) })
                    )
                )
            )
        ),
        React.createElement(Area, { id: "admin_attribute_edit_after", widgets: [] })
    );
}