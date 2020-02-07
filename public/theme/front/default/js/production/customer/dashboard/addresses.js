var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Fetch } from "../../../../../../../js/production/fetch.js";
import Address from "./address.js";

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
            "Your address(s)"
        ),
        addresses.map((a, i) => {
            return React.createElement(
                "div",
                { key: i },
                React.createElement(AddressInfo, { address: a }),
                a.editing && React.createElement(Address, {
                    address: a,
                    id: "customer-address-form-" + i,
                    onComplete: a.customer_address_id ? updateAddress : addresses,
                    countries: _.get(props, 'countries'),
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