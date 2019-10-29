import Text from "../../../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../../../js/production/form/fields/select.js";

export default function CustomOption(props) {
    const [options, setOptions] = React.useState(props.options);

    const addOption = e => {
        e.preventDefault();
        setOptions(options.concat({
            option_id: Date.now(),
            option_name: "",
            option_type: "",
            is_required: "",
            sort_order: ""
        }));
    };

    const removeOption = (key, e) => {
        e.preventDefault();
        const newOptions = options.filter((_, index) => index !== key);
        setOptions(newOptions);
    };

    const addCustomOptionValue = (option_id, e) => {
        e.preventDefault();
        setOptions(options.map((o, i) => {
            if (parseInt(o.option_id) === parseInt(option_id)) {
                let values = o.values === undefined ? [] : o.values;
                values.push({
                    value_id: Date.now(),
                    option_id: option_id,
                    extra_price: "",
                    sort_order: "",
                    value: ""
                });
                o.values = values;
            }
            return o;
        }));
    };

    const removeCustomOptionValue = (option_id, value_id, e) => {
        e.preventDefault();
        setOptions(options.map((o, i) => {
            if (parseInt(o.option_id) === parseInt(option_id)) {
                let values = o.values === undefined ? [] : o.values;
                o.values = values.filter((v, i) => parseInt(v.value_id) !== parseInt(value_id));
            }
            return o;
        }));
    };

    return React.createElement(
        "div",
        { className: "product-edit-custom-option border-block" },
        React.createElement(
            "div",
            { className: "group-form-title" },
            React.createElement(
                "strong",
                null,
                "Custom Options"
            )
        ),
        React.createElement(
            "ul",
            { className: "uk-list" },
            options.map((option, index) => {
                let values = option['values'] === undefined ? [] : option['values'];
                let { option_id, option_name, sort_order, option_type, is_required } = option;
                return React.createElement(
                    "li",
                    { key: index, className: "uk-overflow-auto" },
                    React.createElement(
                        "table",
                        { className: "uk-table uk-table-small" },
                        React.createElement(
                            "thead",
                            null,
                            React.createElement(
                                "tr",
                                null,
                                React.createElement(
                                    "td",
                                    null,
                                    "Option name"
                                ),
                                React.createElement(
                                    "td",
                                    null,
                                    "Type"
                                ),
                                React.createElement(
                                    "td",
                                    null,
                                    "Is required?"
                                ),
                                React.createElement(
                                    "td",
                                    null,
                                    "Sort order"
                                ),
                                React.createElement(
                                    "td",
                                    null,
                                    React.createElement(
                                        "a",
                                        { href: "#", onClick: e => removeOption(index, e) },
                                        React.createElement("span", { "uk-icon": "minus-circle" })
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "tbody",
                            null,
                            React.createElement(
                                "tr",
                                null,
                                React.createElement(
                                    "td",
                                    null,
                                    React.createElement(Text, { formId: "product-edit-form", name: 'options[' + option_id + '][option_name]', value: option_name, validation_rules: ['notEmpty'] })
                                ),
                                React.createElement(
                                    "td",
                                    null,
                                    React.createElement(Select, {
                                        name: 'options[' + option_id + '][option_type]',
                                        value: option_type,
                                        options: [{ value: 'select', text: 'Single choice' }, { value: 'multiselect', text: 'Multiple choice' }, { value: 'freetext', text: 'Free text' }]
                                    })
                                ),
                                React.createElement(
                                    "td",
                                    null,
                                    React.createElement(Select, {
                                        name: 'options[' + option_id + '][is_required]',
                                        value: is_required,
                                        options: [{ value: '1', text: 'Yes' }, { value: '0', text: 'No' }]
                                    })
                                ),
                                React.createElement(
                                    "td",
                                    null,
                                    React.createElement(Text, { name: 'options[' + option_id + '][sort_order]', value: sort_order })
                                )
                            )
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
                                    "Value"
                                ),
                                React.createElement(
                                    "td",
                                    null,
                                    "Extra Price"
                                ),
                                React.createElement(
                                    "td",
                                    null,
                                    "Sort Order"
                                ),
                                React.createElement("td", null)
                            )
                        ),
                        React.createElement(
                            "tbody",
                            null,
                            values.map((val, i) => {
                                let { value_id, option_id, extra_price, sort_order, value } = val;
                                return React.createElement(
                                    "tr",
                                    { key: val.value_id },
                                    React.createElement(
                                        "td",
                                        null,
                                        React.createElement(Text, {
                                            formId: "product-edit-form",
                                            name: 'options[' + option_id + '][values][' + value_id + '][value]',
                                            value: value,
                                            validation_rules: ['notEmpty']
                                        })
                                    ),
                                    React.createElement(
                                        "td",
                                        null,
                                        React.createElement(Text, { name: 'options[' + option_id + '][values][' + value_id + '][extra_price]', value: extra_price })
                                    ),
                                    React.createElement(
                                        "td",
                                        null,
                                        React.createElement(Text, { name: 'options[' + option_id + '][values][' + value_id + '][sort_order]', value: sort_order })
                                    ),
                                    React.createElement(
                                        "td",
                                        { colSpan: "3" },
                                        React.createElement(
                                            "a",
                                            { href: "#", onClick: e => removeCustomOptionValue(option_id, value_id, e) },
                                            React.createElement("span", { "uk-icon": "minus-circle" })
                                        )
                                    )
                                );
                            })
                        ),
                        React.createElement(
                            "tfoot",
                            null,
                            React.createElement(
                                "tr",
                                null,
                                React.createElement(
                                    "td",
                                    { colSpan: "3" },
                                    React.createElement(
                                        "a",
                                        { href: "#", onClick: e => addCustomOptionValue(option_id, e) },
                                        React.createElement("span", { "uk-icon": "plus-circle" })
                                    )
                                )
                            )
                        )
                    )
                );
            })
        ),
        React.createElement(
            "div",
            null,
            React.createElement(
                "a",
                { href: "#", onClick: e => addOption(e) },
                React.createElement("span", { "uk-icon": "plus-circle" })
            )
        )
    );
}