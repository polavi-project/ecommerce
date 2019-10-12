var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Text from "../../../../../../../js/production/formelements/text.js";
import Select from "../../../../../../../js/production/formelements/select.js";

export default class AdvancePrice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            prices: this.props.prices === undefined ? [] : this.props.prices
        };
    }
    addPrice(e) {
        let prices = this.state.prices;
        prices.push({
            customer_group_id: undefined,
            qty: undefined,
            price: undefined,
            active_from: undefined,
            active_to: undefined
        });
        this.props.addFieldToValidate('advance_price[' + (prices.length - 1) + '][price]', ["require"]);
        this.props.addFieldToValidate('advance_price[' + (prices.length - 1) + '][qty]', ["require"]);
        this.setState(_extends({}, this.state, {
            prices: prices
        }));
    }
    removePrice(key) {
        this.props.removeFieldFromValidation('advance_price[' + key + '][price]');
        this.props.removeFieldFromValidation('advance_price[' + key + '][qty]');
        let prices = this.state.prices;
        prices.splice(key, 1);
        this.setState(_extends({}, this.state, {
            prices: prices
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
                    "Advance price"
                )
            ),
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
                            "Customer Group"
                        ),
                        React.createElement(
                            "td",
                            null,
                            "Qty"
                        ),
                        React.createElement(
                            "td",
                            null,
                            "Price"
                        ),
                        React.createElement(
                            "td",
                            null,
                            "Active From"
                        ),
                        React.createElement(
                            "td",
                            null,
                            "Active To"
                        ),
                        React.createElement(
                            "td",
                            null,
                            "Action"
                        )
                    )
                ),
                React.createElement(
                    "tbody",
                    null,
                    this.state.prices.map((price, index) => {
                        return React.createElement(
                            "tr",
                            { key: index },
                            React.createElement(
                                "td",
                                null,
                                React.createElement(Select, {
                                    name: 'advance_price[' + index + '][customer_group_id]',
                                    value: price.customer_group_id,
                                    options: this.props.customer_groups
                                })
                            ),
                            React.createElement(
                                "td",
                                null,
                                React.createElement(Text, { type: "text", name: 'advance_price[' + index + '][qty]', value: price.qty })
                            ),
                            React.createElement(
                                "td",
                                null,
                                React.createElement(Text, { type: "text", name: 'advance_price[' + index + '][price]', value: price.price })
                            ),
                            React.createElement(
                                "td",
                                null,
                                React.createElement(Text, { type: "text", name: 'advance_price[' + index + '][active_from]', value: price.active_from })
                            ),
                            React.createElement(
                                "td",
                                null,
                                React.createElement(Text, { type: "text", name: 'advance_price[' + index + '][active_to]', value: price.active_to })
                            ),
                            React.createElement(
                                "td",
                                null,
                                React.createElement(
                                    "a",
                                    { className: "btn-danger btn-primary", onClick: () => this.removePrice(index) },
                                    React.createElement(
                                        "span",
                                        null,
                                        "Remove Price"
                                    )
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
                            null,
                            React.createElement(
                                "a",
                                { className: "btn btn-primary", onClick: e => this.addPrice() },
                                React.createElement(
                                    "span",
                                    null,
                                    "Add Price"
                                )
                            )
                        )
                    )
                )
            )
        );
    }
}