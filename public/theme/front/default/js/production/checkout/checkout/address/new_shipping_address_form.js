var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { ADD_ALERT, ADD_APP_STATE } from "../../../../../../../../js/production/event-types.js";
import AddressForm from "../../../../production/customer/address/address.js";

export default function ShippingAddressForm(props) {
    const dispatch = ReactRedux.useDispatch();
    const cart = ReactRedux.useSelector(state => _.get(state, 'appState.cart'));

    const onComplete = response => {
        if (_.get(response, 'add_checkout_shipping_address.status') === true) {
            let address = _.get(response, 'add_checkout_shipping_address.address');
            props.areaProps.setNeedSelectAddress(false);
            dispatch({
                'type': ADD_APP_STATE,
                'payload': {
                    'appState': {
                        'cart': _extends({}, cart, {
                            'shippingAddress': address
                        })
                    }
                }
            });
        } else {
            dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: "checkout_shipping_address_error", message: _.get(response, 'add_checkout_shipping_address.message'), type: "error" }] } });
        }
    };

    const onError = () => {
        dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: "checkout_shipping_address_error", message: 'Something wrong. Please try again', type: "error" }] } });
    };

    if (props.areaProps.needSelectAddress === false) return null;

    return React.createElement(
        "div",
        { className: "uk-width-1-1" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "strong",
                null,
                "New address"
            )
        ),
        React.createElement(AddressForm, {
            id: "billing_new_address_form",
            action: _.get(props, 'action'),
            countries: _.get(props, 'countries'),
            onComplete: onComplete,
            onError: onError
        })
    );
}