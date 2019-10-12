var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { ADD_ALERT, ADD_APP_STATE } from "../../../../../../../../js/production/event-types.js";
import Address from "../../../../production/customer/account/address.js";
import { Fetch } from "../../../../../../../../js/production/fetch.js";

function AddressForm(props) {
    const dispatch = ReactRedux.useDispatch();
    const onComplete = response => {
        if (_.get(response, 'payload.data.addShippingAddress.status') === true) {
            let address = _.get(response, 'payload.data.addShippingAddress.address');
            let setAddrs = _.get(props, 'setAddrs');
            setAddrs(() => {
                let flag = false;
                let newAddress = _.get(props, 'addrs').map((a, i) => {
                    if (a.customer_address_id === address.customer_address_id) {
                        flag = true;
                        a = _extends({}, address, { used: true });
                    }
                    return a;
                });
                if (flag === false) newAddress = newAddress.concat(_extends({}, address, { used: true }));

                return newAddress;
            });
            _.get(props, 'setShowForm')(false);
            dispatch({
                'type': ADD_APP_STATE,
                'payload': {
                    'appState': {
                        'cart': {
                            'shippingAddress': address
                        }
                    }
                }
            });
        } else {
            dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: "checkout_shipping_address_error", message: _.get(response, 'payload.data.addShippingAddress.message'), type: "error" }] } });
        }
    };

    const onError = () => {
        dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: "checkout_shipping_address_error", message: 'Something wrong. Please try again', type: "error" }] } });
    };

    return React.createElement(
        "div",
        { className: "uk-width-1-1" },
        React.createElement(
            "h2",
            null,
            "Shipping address"
        ),
        React.createElement(Address, {
            action: _.get(props, 'addAddressUrl'),
            countries: _.get(props, 'countries'),
            onComplete: onComplete,
            onError: onError
        })
    );
}

function Addr(props) {
    const dispatch = ReactRedux.useDispatch();
    const onComplete = response => {
        let address = props.address;
        if (_.get(response, 'payload.data.addShippingAddress.status') === true) {
            _.get(props, 'setAddrs')(() => {
                return props.addrs.map((a, i) => {
                    a.used = a.customer_address_id === null && address.customer_address_id === null || parseInt(a.customer_address_id) === parseInt(address.customer_address_id);
                    return a;
                });
            });
            _.get(props, 'setShowForm')(false);
            dispatch({
                'type': ADD_APP_STATE,
                'payload': {
                    'appState': {
                        'cart': {
                            'shippingAddress': address
                        }
                    }
                }
            });
        } else {
            dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: "checkout_shipping_address_error", message: _.get(response, 'payload.data.addShippingAddress.message'), type: "error" }] } });
        }
    };

    const onError = () => {
        dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: "checkout_shipping_address_error", message: 'Something wrong. Please try again', type: "error" }] } });
    };

    const onClick = e => {
        e.preventDefault();
        let address = props.address;
        if (address.used === true) return;

        let formData = new FormData();
        for (let key in address) {
            if (address.hasOwnProperty(key)) {
                if (address[key] !== null && key !== 'customer_address_id' && key !== 'used') formData.append(`variables[address][${key}]`, address[key]);
            }
        }
        formData.append(`variables[cartId]`, props.cartId);
        formData.append('query', "mutation AddShippingAddress($address: CustomerAddressInput!, $cartId: Int!) { addShippingAddress (address: $address, cartId: $cartId) {status message address {customer_address_id}}}");

        Fetch(_.get(props, 'addAddressUrl'), false, 'POST', formData, null, onComplete, onError);
    };

    return React.createElement(
        "div",
        { className: _.get(props, 'address').used === true ? 'uk-width-1-2 checkout-shipping-address selected' : 'uk-width-1-2 checkout-shipping-address' },
        React.createElement(
            "div",
            null,
            React.createElement(
                "strong",
                null,
                _.get(_.get(props, 'address'), 'full_name')
            )
        ),
        React.createElement(
            "div",
            null,
            _.get(_.get(props, 'address'), 'address_1')
        ),
        React.createElement(
            "div",
            null,
            _.get(_.get(props, 'address'), 'address_2')
        ),
        React.createElement(
            "div",
            null,
            _.get(_.get(props, 'address'), 'city'),
            ", ",
            _.get(_.get(props, 'address'), 'province'),
            ", ",
            _.get(_.get(props, 'address'), 'postcode')
        ),
        React.createElement(
            "div",
            null,
            _.get(_.get(props, 'address'), 'country')
        ),
        React.createElement(
            "div",
            null,
            React.createElement(
                "span",
                null,
                "Phone"
            ),
            ": ",
            _.get(_.get(props, 'address'), 'telephone')
        ),
        React.createElement(
            "a",
            { href: "#", onClick: e => onClick(e) },
            React.createElement("span", { "uk-icon": "icon: location; ratio: 1" }),
            " Ship here"
        )
    );
}

export default function CustomerAddresses(props) {
    const [addrs, setAddrs] = React.useState(_.get(props, 'addresses', []));
    const [showForm, setShowForm] = React.useState(_.get(props, 'addresses', []).length === 0);

    return React.createElement(
        "div",
        { className: "address-list-checkout uk-grid uk-grid-small" },
        addrs.map((a, i) => {
            return React.createElement(Addr, {
                key: i,
                cartId: props.cartId,
                address: a,
                addrs: addrs,
                setAddrs: setAddrs,
                setShowForm: setShowForm,
                addAddressUrl: props.addAddressUrl
            });
        }),
        showForm === false && React.createElement(
            "a",
            { href: "#", onClick: e => {
                    e.preventDefault();setShowForm(true);
                } },
            "Another address"
        ),
        showForm === true && React.createElement(
            "div",
            { className: "uk-width-1-1" },
            React.createElement(AddressForm, {
                addAddressUrl: props.addAddressUrl,
                countries: props.countries,
                addrs: addrs,
                setAddrs: setAddrs,
                setShowForm: setShowForm
            })
        )
    );
}