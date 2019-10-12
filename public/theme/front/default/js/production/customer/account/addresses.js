var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Form } from "../../../../../../../js/production/form/form.js";
import Area from "../../../../../../../js/production/area.js";
import Text from "../../../../../../../js/production/form/fields/text.js";
import { REQUEST_END } from "../../../../../../../js/production/event-types.js";
import { ProvinceOptions } from "../../../../../../../js/production/locale/province_option.js";
import Select from "../../../../../../../js/production/form/fields/select.js";
import { CountryOptions } from "../../../../../../../js/production/locale/country_option.js";
import { Fetch } from "../../../../../../../js/production/fetch.js";
import Hidden from "../../../../../../../js/production/form/fields/hidden.js";

function Province(props) {
    return React.createElement(
        ProvinceOptions,
        props,
        React.createElement(Select, {
            value: props.province,
            label: "Province"
        })
    );
}

function Country(props) {
    return React.createElement(
        CountryOptions,
        props,
        React.createElement(Select, {
            value: props.country,
            label: "Country",
            validation_rules: ["notEmpty"]
        })
    );
}
//
// const mapStateToProps = (state, ownProps) => {
//     return state.customerInfo.email ? state.customerInfo : ownProps;
// };
//
// function infoReducer(info = {}, action = {}) {
//     if(
//         action.type === REQUEST_END &&
//         action.updateCustomer
//     ) {
//         return action.updateCustomer.customer;
//     }
//     return info;
// }
//
// ReducerRegistry.register('customerInfo', infoReducer);

function EditForm(props) {

    const onComplete = response => {
        if (_.get(response, "payload.data.createCustomerAddress.status") === true) {
            props.updateAddress(props.index, _extends({}, _.get(response, "payload.data.createCustomerAddress.address"), { editing: false }));
        } else if (_.get(response, "payload.data.updateCustomerAddress.status") === true) {
            props.updateAddress(props.index, _extends({}, _.get(response, "payload.data.updateCustomerAddress.address"), { editing: false }));
        }
    };

    return React.createElement(
        Form,
        {
            id: "address-form-" + props.index,
            onComplete: onComplete,
            action: props.action },
        React.createElement(Area, {
            id: "address-form-inner-" + props.index,
            coreWidgets: [{
                'component': Text,
                'props': {
                    name: "address[full_name]",
                    value: props.address.full_name,
                    formId: "address-form-" + props.index,
                    label: "Full name",
                    validation_rules: ['notEmpty']
                },
                'sort_order': 10,
                'id': 'full_name'
            }, {
                'component': Text,
                'props': {
                    name: "address[telephone]",
                    value: props.address.telephone,
                    formId: "address-form-" + props.index,
                    label: "Telephone",
                    validation_rules: ['notEmpty']
                },
                'sort_order': 30,
                'id': 'telephone'
            }, {
                'component': Text,
                'props': {
                    name: "address[address_1]",
                    value: props.address.address_1,
                    formId: "address-form-" + props.index,
                    label: "Address 1",
                    validation_rules: ['notEmpty']
                },
                'sort_order': 40,
                'id': 'address_1'
            }, {
                'component': Text,
                'props': {
                    name: "address[address_2]",
                    value: props.address.address_2,
                    formId: "address-form-" + props.index,
                    label: "Address 2",
                    validation_rules: []
                },
                'sort_order': 50,
                'id': 'address_2'
            }, {
                'component': Text,
                'props': {
                    name: "address[postcode]",
                    value: props.address.postcode,
                    formId: "address-form-" + props.index,
                    label: "Postcode",
                    validation_rules: []
                },
                'sort_order': 60,
                'id': 'postcode'
            }, {
                'component': Text,
                'props': {
                    name: "address[city]",
                    value: props.address.email,
                    formId: "address-form-" + props.index,
                    label: "City",
                    validation_rules: []
                },
                'sort_order': 70,
                'id': 'city'
            }, {
                'component': Province,
                'props': {
                    name: "address[province]",
                    value: props.address.province,
                    formId: "address-form-" + props.index,
                    label: "Province",
                    validation_rules: []
                },
                'sort_order': 80,
                'id': 'province'
            }, {
                'component': Country,
                'props': {
                    name: "address[country]",
                    value: props.address.country,
                    formId: "address-form-" + props.index,
                    label: "Country",
                    validation_rules: ['notEmpty']
                },
                'sort_order': 90,
                'id': 'country'
            }]
        }),
        props.address.customer_address_id && React.createElement(Hidden, { name: "id", value: props.address.customer_address_id })
    );
}

function Address({ address }) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "div",
            null,
            address.full_name
        ),
        React.createElement(
            "div",
            null,
            address.address_1
        ),
        React.createElement(
            "div",
            null,
            address.city,
            " ",
            address.province
        ),
        React.createElement(
            "div",
            null,
            address.country
        ),
        React.createElement(
            "div",
            null,
            address.is_default && React.createElement("span", { "uk-icon": "icon: location; ratio: 1" })
        )
    );
}

export default function Addresses(props) {
    const [addresses, setAddresses] = React.useState(props.addresses ? props.addresses : []);
    const addAddress = e => {
        e.preventDefault();
        setAddresses(addresses.concat({
            index: addresses.length,
            is_default: false,
            editing: true
        }));
    };

    const deleteAddress = id => {
        Fetch(props.deleteUrl, false, 'POST', { id: id }, null, response => {
            if (_.get(response, "payload.data.deleteCustomerAddress.status") === true) {
                const newAddresses = addresses.filter((addr, index) => parseInt(addr.customer_address_id) !== parseInt(id));
                setAddresses(newAddresses);
            }
        });
    };

    const updateAddress = (index, address) => {
        setAddresses(() => {
            return addresses.map((a, i) => {
                if (parseInt(i) === parseInt(index)) return address;
                return a;
            });
        });
    };

    return React.createElement(
        "div",
        { className: "uk-grid-small uk-width-1-2@m" },
        React.createElement(
            "h2",
            null,
            "Address"
        ),
        addresses.map((a, i) => {
            return React.createElement(
                "div",
                { key: i },
                React.createElement(Address, { address: a }),
                a.editing && React.createElement(EditForm, {
                    address: a,
                    index: i,
                    updateAddress: updateAddress,
                    action: a.customer_address_id ? props.updateUrl : props.createUrl
                }),
                !a.editing && React.createElement(
                    "a",
                    {
                        href: "#",
                        onClick: e => {
                            e.preventDefault();updateAddress(i, _extends({}, a, { editing: true }));
                        } },
                    React.createElement("span", { "uk-icon": "icon: file-edit; ratio: 0.8" })
                ),
                a.customer_address_id && React.createElement(
                    "a",
                    { href: "#", onClick: e => {
                            e.preventDefault();deleteAddress(a.customer_address_id);
                        } },
                    React.createElement("span", { "uk-icon": "icon: trash; ratio: 0.8" })
                )
            );
        }),
        React.createElement(
            "a",
            { href: "#", onClick: e => addAddress(e) },
            "Add new"
        )
    );
}