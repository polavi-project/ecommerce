import Text from "../../../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../../../js/production/form/fields/select.js";
import Datefield from "../../../../../../../../js/production/form/fields/date.js";

export default function AdvancedPrice(props) {
    const [prices, setPrices] = React.useState(props.prices !== undefined ? props.prices : []);

    const removePrice = (e, key) => {
        e.preventDefault();
        const newPrices = prices.filter((_, index) => index !== key);

        setPrices(newPrices);
    };

    const addPrice = e => {
        e.preventDefault();
        setPrices(prices.concat({
            product_price_id: Date.now(),
            customer_group_id: "",
            qty: "",
            price: "",
            active_from: "",
            active_to: ""
        }));
    };
    return React.createElement(
        "div",
        { className: "sml-block mt-4" },
        React.createElement(
            "div",
            { className: "sml-block-title" },
            "Advance price"
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
                        "th",
                        null,
                        "Customer Group"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Qty"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Price"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Active From"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Active To"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Action"
                    )
                )
            ),
            React.createElement(
                "tbody",
                null,
                prices.map((price, index) => {
                    return React.createElement(
                        "tr",
                        { key: index },
                        React.createElement(
                            "td",
                            null,
                            React.createElement(Select, {
                                name: 'advance_price[' + price.product_price_id + '][customer_group_id]',
                                value: price.customer_group_id,
                                options: props.customerGroups
                            })
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(Text, { formId: props.formId, key: "qty_" + index, type: "text", name: 'advance_price[' + price.product_price_id + '][qty]', value: price.qty, validation_rules: ["number"] })
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(Text, { formId: props.formId, key: "price_" + index, type: "text", name: 'advance_price[' + price.product_price_id + '][tier_price]', value: price.price, validation_rules: ["notEmpty"] })
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(Datefield, { formId: props.formId, type: "text", name: 'advance_price[' + price.product_price_id + '][active_from]', value: price.active_from })
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(Datefield, { formId: props.formId, type: "text", name: 'advance_price[' + price.product_price_id + '][active_to]', value: price.active_to })
                        ),
                        React.createElement(
                            "td",
                            { className: "align-middle" },
                            React.createElement(
                                "a",
                                { onClick: e => removePrice(e, index), href: "javascript:void(0)", className: "text-danger" },
                                React.createElement("i", { className: "fas fa-trash-alt" })
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
                            { onClick: addPrice, href: "javascript:void(0)" },
                            React.createElement("i", { className: "fas fa-plus" })
                        )
                    )
                )
            )
        )
    );
}