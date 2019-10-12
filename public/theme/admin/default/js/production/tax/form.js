var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Form } from "../../../../../../js/production/form/form.js";
import Area from "../../../../../../js/production/area.js";
import Text from "../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../js/production/form/fields/select.js";
import { CountryOptions } from "../../../../../../js/production/locale/country_option.js";
import { ProvinceOptions } from "../../../../../../js/production/locale/province_option.js";

function Rates(props) {
    const [rates, setRates] = React.useState(props.rates);

    const addRate = e => {
        e.persist();
        e.preventDefault();
        setRates(rates.concat({
            name: "",
            country: "",
            province: "",
            postcode: "",
            rate: "",
            is_compound: "",
            priority: ""
        }));
    };

    const removeRate = key => {
        const newRates = rates.filter((_, index) => index !== key);
        setRates(newRates);
    };

    const onChangeCountry = (e, index) => {
        e.persist();
        setRates(() => {
            return rates.map((r, i) => {
                if (i === index) r.country = e.target.value;
                return r;
            });
        });
    };

    return React.createElement(
        "div",
        { className: "uk-overflow-auto" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "span",
                null,
                "Tax rates"
            )
        ),
        React.createElement(
            "table",
            { className: "uk-table uk-table-divider uk-table-striped uk-table-small uk-table-justify" },
            React.createElement(
                "thead",
                null,
                React.createElement(
                    "tr",
                    null,
                    React.createElement(
                        "th",
                        null,
                        "Name"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Country"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Province"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Postcode"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Rate"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Is compound?"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Priority"
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
                rates.map((rate, index) => {
                    return React.createElement(
                        "tr",
                        { key: index },
                        React.createElement(
                            "td",
                            null,
                            React.createElement(Text, { name: 'tax_rate[' + index + '][name]', value: rate.name, validation_rules: ["required"] })
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                CountryOptions,
                                null,
                                React.createElement(Select, {
                                    name: 'tax_rate[' + index + '][country]',
                                    value: rate.country,
                                    index: index,
                                    handler: e => onChangeCountry(e, index)
                                })
                            )
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                ProvinceOptions,
                                { country: rate.country },
                                React.createElement(Select, {
                                    name: 'tax_rate[' + index + '][province]',
                                    value: rate.province
                                })
                            )
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(Text, { name: 'tax_rate[' + index + '][postcode]', value: rate.postcode })
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(Text, { name: 'tax_rate[' + index + '][rate]', value: rate.rate })
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(Select, {
                                name: 'tax_rate[' + index + '][is_compound]',
                                value: rate.is_compound,
                                options: [{
                                    value: 0,
                                    text: 'No'
                                }, {
                                    value: 1,
                                    text: 'Yes'
                                }]
                            })
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(Text, { name: 'tax_rate[' + index + '][priority]', value: rate.priority })
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                "a",
                                { onClick: () => removeRate(index) },
                                React.createElement(
                                    "span",
                                    null,
                                    "Remove rate"
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
                            { className: "uk-button-primary uk-button-small", onClick: e => addRate(e) },
                            React.createElement(
                                "span",
                                null,
                                "Add rate"
                            )
                        )
                    )
                )
            )
        )
    );
}

function TaxClass(props) {
    return React.createElement(
        "li",
        null,
        React.createElement(
            "a",
            { className: "uk-accordion-title", href: "#" },
            props.name
        ),
        React.createElement(
            "div",
            { className: "uk-accordion-content" },
            React.createElement(
                Form,
                _extends({ id: props.formId }, props),
                React.createElement("input", { type: "hidden", value: props.tax_class_id, name: "id" }),
                React.createElement(Area, { id: "tax_class_edit_form", coreWidgets: [{
                        'component': Text,
                        'props': {
                            name: "name",
                            validation_rules: ['notEmpty'],
                            value: props.name,
                            formId: props.formId
                        },
                        'sort_order': 10,
                        'id': 'tax_class_edit_name'
                    }, {
                        'component': Rates,
                        'props': { rates: props.rates ? props.rates : [] },
                        'sort_order': 20,
                        'id': 'tax_class_edit_rates'
                    }] })
            )
        )
    );
}

export default function Taxes({ classes, saveAction }) {
    const [taxes, setTaxes] = React.useState(classes);

    const addTax = e => {
        e.preventDefault();
        setTaxes(taxes.concat({
            formId: 'tax_class_edit_' + Math.floor(Math.random() * (10000 - 1000) + 1000),
            tax_class_id: undefined,
            name: "Tax class name goes here",
            rates: []
        }));
    };

    const removeTax = key => {
        const newTaxes = taxes.filter((_, index) => index !== key);
        setTaxes(newTaxes);
    };
    return React.createElement(
        "div",
        null,
        React.createElement(
            "ul",
            { "uk-accordion": "multiple: true" },
            taxes.map((t, i) => {
                return React.createElement(TaxClass, _extends({ key: i, action: saveAction }, t));
            })
        ),
        React.createElement(
            "a",
            { onClick: e => addTax(e) },
            "Add tax class"
        )
    );
}