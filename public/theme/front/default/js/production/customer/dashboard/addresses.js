var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Fetch } from "../../../../../../../js/production/fetch.js";
import Address from "./address.js";
import { ADD_ALERT } from "../../../../../../../js/production/event-types.js";

function AddressInfo({ address }) {
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
    const dispatch = ReactRedux.useDispatch();

    const addAddress = e => {
        e.preventDefault();
        setAddresses(addresses.concat({
            customer_address_id: Date.now(),
            is_default: 0,
            editing: true
        }));
    };

    const deleteAddress = address => {
        console.log(address);
        if (address.delete_url) Fetch(address.delete_url, false, 'POST', {}, null, response => {
            if (_.get(response, "addressDelete.status") === true) {
                const newAddresses = addresses.filter(addr => parseInt(addr.customer_address_id) !== parseInt(address.customer_address_id));
                setAddresses(newAddresses);
            } else {
                dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: "delete_customer_address_error", message: _.get(response, 'addressDelete.message', "Something wrong. Please try again"), type: "error" }] } });
            }
        });else {
            const newAddresses = addresses.filter(addr => parseInt(addr.customer_address_id) !== parseInt(address.customer_address_id));
            setAddresses(newAddresses);
        }
    };

    const updateAddress = (address, response) => {
        let newAddress = null;
        if (address.update_url) newAddress = _.get(response, 'addressUpdate');else newAddress = _.get(response, 'addressCreation');
        if (_.get(newAddress, 'status') === true) {
            setAddresses(addresses.map(a => {
                if (parseInt(a.customer_address_id) === parseInt(address.customer_address_id)) return _extends({}, a, newAddress.address, { editing: false });else return a;
            }));
            dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: "save_customer_address_success", message: "Address saved successfully", type: "success" }] } });
        } else {
            dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: "save_customer_address_error", message: _.get(newAddress, 'message', 'Something wrong, please try again'), type: "error" }] } });
        }
    };

    const onStart = (config, address) => {
        config.body.append('variables[customerId]', parseInt(props.customer_id));
    };

    return React.createElement(
        "div",
        { className: "" },
        React.createElement(
            "h2",
            null,
            "Your address(s)"
        ),
        addresses.map((a, i) => {
            return React.createElement(
                "div",
                { key: i, className: "border-block" },
                React.createElement(AddressInfo, { address: a }),
                a.editing && React.createElement(Address, {
                    address: a,
                    id: "customer-address-form-" + i,
                    onStart: config => onStart(config, a),
                    onComplete: response => updateAddress(a, response),
                    countries: _.get(props, 'countries'),
                    action: a.update_url ? a.update_url : props.createUrl
                }),
                !a.editing && React.createElement(
                    "a",
                    {
                        href: "#",
                        onClick: e => {
                            e.preventDefault();
                            setAddresses(addresses.map(_a => {
                                if (parseInt(_a.customer_address_id) === parseInt(a.customer_address_id)) return _extends({}, _a, { editing: true });else return _a;
                            }));
                        } },
                    React.createElement("span", { "uk-icon": "icon: file-edit; ratio: 0.8" })
                ),
                React.createElement(
                    "a",
                    { href: "#", onClick: e => {
                            e.preventDefault();deleteAddress(a);
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