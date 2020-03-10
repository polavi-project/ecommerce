import { ADD_ALERT, ADD_APP_STATE } from "../../../../../../../../js/production/event-types.js";
import { Fetch } from "../../../../../../../../js/production/fetch.js";

function Address({ address, cartId, addressType = 'shipping', action, setNeedSelectAddress }) {
    const dispatch = ReactRedux.useDispatch();
    const onComplete = response => {
        let path = addressType === 'shipping' ? 'payload.data.addShippingAddress' : 'payload.data.addBillingAddress';
        if (_.get(response, path + '.status') === true) {
            setNeedSelectAddress(false);
            if (addressType === 'shipping') dispatch({
                'type': ADD_APP_STATE,
                'payload': {
                    'appState': {
                        'cart': {
                            'shippingAddress': address
                        }
                    }
                }
            });else dispatch({
                'type': ADD_APP_STATE,
                'payload': {
                    'appState': {
                        'cart': {
                            'billingAddress': address
                        }
                    }
                }
            });
        } else {
            dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: `checkout_${addressType}_address_error`, message: _.get(response, path + '.message'), type: "error" }] } });
        }
    };

    const onError = () => {
        dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: `checkout_${addressType}_address_error`, message: 'Something wrong. Please try again', type: "error" }] } });
    };

    const onClick = e => {
        e.preventDefault();
        let formData = new FormData();
        for (let key in address) {
            if (address.hasOwnProperty(key)) {
                if (address[key] !== null && key !== 'customer_address_id' && key !== 'delete_url' && key !== 'update_url') formData.append(`variables[address][${key}]`, address[key]);
            }
        }
        formData.append(`variables[cartId]`, cartId);
        if (addressType === 'shipping') formData.append('query', "mutation AddShippingAddress($address: AddressInput!, $cartId: Int!) { addShippingAddress (address: $address, cartId: $cartId) {status message address {customer_address_id}}}");
        if (addressType === 'billing') formData.append('query', "mutation AddBillingAddress($address: AddressInput!, $cartId: Int!) { addBillingAddress (address: $address, cartId: $cartId) {status message address {customer_address_id}}}");
        Fetch(action, false, 'POST', formData, null, onComplete, onError);
    };

    return React.createElement(
        "div",
        { className: "uk-width-1-2 checkout-shipping-address" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "strong",
                null,
                address.full_name
            )
        ),
        React.createElement(
            "div",
            null,
            address.address_1
        ),
        React.createElement(
            "div",
            null,
            address.address_2
        ),
        React.createElement(
            "div",
            null,
            address.city,
            ", ",
            address.province,
            ", ",
            address.postcode
        ),
        React.createElement(
            "div",
            null,
            address.country
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
            address.telephone
        ),
        React.createElement(
            "a",
            { href: "#", onClick: e => onClick(e) },
            React.createElement("span", { "uk-icon": "icon: location; ratio: 1" }),
            " Use this address"
        )
    );
}

export default function CheckoutAddressBook({ addresses = [], cartId, addressType = 'shipping', action, areaProps }) {
    if (addresses.length === 0 || areaProps.needSelectAddress === false) return null;

    return React.createElement(
        "div",
        { className: "checkout-address-book" },
        React.createElement(
            "h3",
            null,
            "Address book"
        ),
        addresses.map((a, i) => {
            return React.createElement(Address, {
                address: a,
                key: i,
                cartId: cartId,
                addressType: addressType,
                action: action,
                setNeedSelectAddress: areaProps.setNeedSelectAddress
            });
        })
    );
}