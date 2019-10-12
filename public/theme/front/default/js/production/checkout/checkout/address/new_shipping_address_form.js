import { ADD_ALERT, ADD_APP_STATE } from "../../../../../../../../js/production/event-types.js";
import AddressForm from "../../../../production/customer/account/address.js";

export default function ShippingAddressForm(props) {
    const dispatch = ReactRedux.useDispatch();
    const onComplete = response => {
        if (_.get(response, 'payload.data.addShippingAddress.status') === true) {
            let address = _.get(response, 'payload.data.addShippingAddress.address');
            props.areaProps.setNeedSelectAddress(false);
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
            action: _.get(props, 'action'),
            countries: _.get(props, 'countries'),
            onComplete: onComplete,
            onError: onError
        })
    );
}