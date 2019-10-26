var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Form } from "../../../../../../../js/production/form/form.js";
import Area from "../../../../../../../js/production/area.js";
import Text from "../../../../../../../js/production/form/fields/text.js";
import Select from "../../../../../../../js/production/form/fields/select.js";
import { CountryOptions } from "../../../../../../../js/production/locale/country_option.js";
import Multiselect from "../../../../../../../js/production/form/fields/multiselect.js";

function Country({ countries = [] }) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            CountryOptions,
            null,
            React.createElement(Multiselect, {
                value: countries,
                label: "Applicable countries",
                name: "shipment_flat_rate_countries[]",
                className: "uk-form-small"
            })
        )
    );
}

export default function FlatRateSettingForm(props) {

    const [showForm, setShowForm] = React.useState(false);
    const onClick = e => {
        e.preventDefault();
        setShowForm(!showForm);
    };

    return React.createElement(
        "div",
        null,
        React.createElement(
            "p",
            null,
            "Flat Rate",
            React.createElement(
                "a",
                { onClick: e => onClick(e) },
                "Edit"
            )
        ),
        React.createElement(
            "div",
            { style: { display: showForm ? 'block' : 'none' } },
            React.createElement(
                Form,
                _extends({
                    id: "flat_rate-setting-form"
                }, props),
                React.createElement(Area, { id: "flat_rate-setting-form", coreWidgets: [{
                        component: Text,
                        props: { id: 'shipment_flat_rate_name', value: _.get(props, 'shipment_flat_rate_name', ''), formId: "flat_rate-setting-form", name: "shipment_flat_rate_name", label: "Title", validation_rules: ["notEmpty"] },
                        sort_order: 10,
                        id: "shipment_flat_rate_name"
                    }, {
                        component: Text,
                        props: { id: 'shipment_flat_rate_fee', value: _.get(props, 'shipment_flat_rate_fee', ''), formId: "flat_rate-setting-form", name: "shipment_flat_rate_fee", label: "Shipping fee", validation_rules: ["notEmpty"] },
                        sort_order: 20,
                        id: "shipment_flat_rate_fee"
                    }, {
                        component: Select,
                        props: { id: 'shipment_flat_rate_status', value: _.get(props, 'shipment_flat_rate_status', ''), formId: "flat_rate-setting-form", name: "shipment_flat_rate_status", label: "Status", options: [{ value: 0, text: 'Disabled' }, { value: 1, text: 'Enabled' }], isTranslateAble: false },
                        sort_order: 30,
                        id: "shipment_flat_rate_status"
                    }, {
                        component: Country,
                        props: { id: 'shipment_flat_rate_countries', countries: _.get(props, 'shipment_flat_rate_countries', []), formId: "flat_rate-setting-form" },
                        sort_order: 40,
                        id: "shipment_flat_rate_countries"
                    }, {
                        component: Text,
                        props: { id: 'shipment_flat_rate_sort_order', value: _.get(props, 'shipment_flat_rate_sort_order', ''), formId: "flat_rate-setting-form", name: "shipment_flat_rate_sort_order", label: "Sort order" },
                        sort_order: 50,
                        id: "shipment_flat_rate_sort_order"
                    }] })
            )
        )
    );
}