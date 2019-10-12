var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Text from "../../../../../../../js/production/formelements/text.js";
import Select from "../../../../../../../js/production/formelements/select.js";

export default class CustomOption extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            custom_options: this.props.custom_options === undefined ? [] : this.props.custom_options
        };
    }

    addOption(e) {
        let options = this.state.custom_options;
        const id = Date.now();
        options.push({
            product_custom_option_id: id,
            option_name: undefined,
            option_type: undefined,
            is_required: undefined,
            sort_order: undefined
        });
        this.props.addFieldToValidate('custom_options[' + id + '][option_name]', ["require"]);
        this.setState(_extends({}, this.state, {
            custom_options: options
        }));
    }

    removeOption(id) {
        let options = this.state.custom_options;
        if (index !== -1) options.splice(index, 1);
        this.props.removeFieldFromValidation('custom_options[' + id + '][option_name]');
        this.setState(_extends({}, this.state, {
            custom_options: options
        }));
    }

    addCustomOptionValue(option_id) {
        let index = this.state.custom_options.findIndex(f => {
            return f.product_custom_option_id === option_id;
        });
        if (index === -1) throw new TypeError("Requested option does not exist");
        let option = this.state.custom_options[index];
        if (option.values === undefined) option.values = [];
        const id = Date.now();
        option.values.push({
            product_custom_option_values_id: id,
            option_id: option_id,
            extra_price: undefined,
            sort_order: undefined,
            value: undefined
        });
        this.props.addFieldToValidate('option_values[' + option_id + '][' + id + '][value]', ["require"]);
        this.props.addFieldToValidate('option_values[' + option_id + '][' + id + '][extra_price]', ["require"]);
        let options = this.state.custom_options;
        options[index] = option;
        this.setState(_extends({}, this.state, {
            custom_options: options
        }));
    }

    removeCustomOptionValue(option_id, value_id) {
        console.log(option_id);
        console.log(value_id);
        let index = this.state.custom_options.findIndex(f => {
            return f.product_custom_option_id === option_id;
        });
        if (index === -1) throw new TypeError("Requested option does not exist");
        let option = this.state.custom_options[index];
        let val_key = option.values.findIndex(f => {
            return f.product_custom_option_values_id === value_id;
        });
        if (val_key === -1) throw new TypeError("Requested option value does not exist");
        this.props.removeFieldFromValidation('option_values[' + option_id + '][' + value_id + '][value]');
        this.props.removeFieldFromValidation('option_values[' + option_id + '][' + value_id + '][extra_price]');
        option.values.splice(val_key, 1);
        console.log(option);
        let options = this.state.custom_options;
        options[index] = option;
        this.setState(_extends({}, this.state, {
            custom_options: options
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
                    "Custom options"
                )
            ),
            React.createElement(
                "ul",
                null,
                this.state.custom_options.map((option, index) => {
                    let values = option['values'] === undefined ? [] : option['values'];
                    let { product_custom_option_id } = option;
                    return React.createElement(
                        "li",
                        { key: index },
                        React.createElement(
                            "table",
                            { className: "table" },
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
                                            { href: "javascript:void(0);", onClick: () => this.removeOption(option.product_custom_option_id) },
                                            "Remove"
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
                                        React.createElement(Text, { name: 'custom_options[' + product_custom_option_id + '][option_name]', value: option.option_name })
                                    ),
                                    React.createElement(
                                        "td",
                                        null,
                                        React.createElement(Select, {
                                            name: 'custom_options[' + product_custom_option_id + '][option_type]',
                                            value: option.option_type,
                                            options: [{ value: 'select', 'text': 'Single choice' }, { value: 'multiselect', 'text': 'Multiple choice' }]
                                        })
                                    ),
                                    React.createElement(
                                        "td",
                                        null,
                                        React.createElement(Select, {
                                            name: 'custom_options[' + product_custom_option_id + '][is_required]',
                                            value: option.is_required,
                                            options: [{ value: '1', 'text': 'Yes' }, { value: '0', 'text': 'No' }]
                                        })
                                    ),
                                    React.createElement(
                                        "td",
                                        null,
                                        React.createElement(Text, { name: 'custom_options[' + product_custom_option_id + '][sort_order]', value: option.sort_order })
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
                                    let { product_custom_option_values_id, option_id, extra_price, sort_order, value } = val;
                                    return React.createElement(
                                        "tr",
                                        { key: i },
                                        React.createElement(
                                            "td",
                                            null,
                                            React.createElement(Text, { name: 'option_values[' + option_id + '][' + product_custom_option_values_id + '][value]', value: value })
                                        ),
                                        React.createElement(
                                            "td",
                                            null,
                                            React.createElement(Text, { name: 'option_values[' + option_id + '][' + product_custom_option_values_id + '][extra_price]', value: extra_price })
                                        ),
                                        React.createElement(
                                            "td",
                                            null,
                                            React.createElement(Text, { name: 'option_values[' + option_id + '][' + product_custom_option_values_id + '][sort_order]', value: sort_order })
                                        ),
                                        React.createElement(
                                            "td",
                                            { colSpan: "3" },
                                            React.createElement(
                                                "a",
                                                { href: "javascript:void(0);", onClick: () => this.removeCustomOptionValue(option_id, product_custom_option_values_id) },
                                                "Remove value"
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
                                            { href: "javascript:void(0);", onClick: () => this.addCustomOptionValue(option.product_custom_option_id) },
                                            "Add value"
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
                    { href: "javascript:void(0);", onClick: () => this.addOption() },
                    "Add custom option"
                )
            )
        );
    }
}