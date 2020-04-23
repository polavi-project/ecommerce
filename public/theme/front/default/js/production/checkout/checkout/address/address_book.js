var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { ADD_ALERT, ADD_APP_STATE } from "../../../../../../../../js/production/event-types.js";
import { Fetch } from "../../../../../../../../js/production/fetch.js";
import AddressSummary from "../../../customer/address/address_summary.js";

function Address({ address, cartId, addressType = 'shipping', action, setNeedSelectAddress }) {
    const cart = ReactRedux.useSelector(state => _.get(state, 'appState.cart'));
    const dispatch = ReactRedux.useDispatch();
    const onComplete = response => {
        let path = addressType === 'shipping' ? 'add_checkout_shipping_address' : 'add_checkout_billing_address';
        if (_.get(response, path + '.status') === true) {
            setNeedSelectAddress(false);
            if (addressType === 'shipping') dispatch({
                'type': ADD_APP_STATE,
                'payload': {
                    'appState': {
                        'cart': _extends({}, cart, {
                            'shippingAddress': address
                        })
                    }
                }
            });else dispatch({
                'type': ADD_APP_STATE,
                'payload': {
                    'appState': {
                        'cart': _extends({}, cart, {
                            'billingAddress': address
                        })
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

        Fetch(action, false, 'POST', formData, null, onComplete, onError);
    };

    return React.createElement(AddressSummary, { address: address });
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