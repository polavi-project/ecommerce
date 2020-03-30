var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Fetch } from "../../../../../../../../js/production/fetch.js";
import { ADD_ALERT, ADD_APP_STATE } from "../../../../../../../../js/production/event-types.js";

export default function UseShippingOrAnother({ areaProps, action }) {
    const billingAddress = ReactRedux.useSelector(state => _.get(state, 'appState.cart.billingAddress'));
    const cart = ReactRedux.useSelector(state => _.get(state, 'appState.cart'));
    const cartId = ReactRedux.useSelector(state => _.get(state, 'appState.cart.cartId'));
    const dispatch = ReactRedux.useDispatch();

    const set$UseShippping = e => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('variables[cartId]', cartId);
        Fetch(action, false, 'POST', formData, null, response => {
            if (_.get(response, 'add_checkout_billing_address.status') === true) {
                areaProps.setNeedSelectAddress(false);
                dispatch({
                    'type': ADD_APP_STATE,
                    'payload': {
                        'appState': {
                            'cart': _extends({}, cart, {
                                'billingAddress': false
                            })
                        }
                    }
                });
            } else {
                dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: `checkout_billing_address_error`, message: _.get(response, 'add_checkout_billing_address.message', "Something wrong. Please try again"), type: "error" }] } });
            }
        }, () => {
            dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: `checkout_billing_address_error`, message: 'Something wrong. Please try again', type: "error" }] } });
        });
    };
    return React.createElement(
        "div",
        { className: "checkout-billing-address-use-shipping" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                null,
                React.createElement(
                    "label",
                    null,
                    React.createElement("input", { onChange: e => {
                            set$UseShippping(e);
                        }, type: "radio", className: "uk-radio", checked: billingAddress === false && areaProps.needSelectAddress === false }),
                    " Use shipping address"
                )
            ),
            React.createElement(
                "div",
                null,
                React.createElement(
                    "label",
                    null,
                    React.createElement("input", { onChange: e => {
                            areaProps.setNeedSelectAddress(true);
                        }, type: "radio", className: "uk-radio", checked: billingAddress !== false || areaProps.needSelectAddress === true }),
                    " Use another address"
                )
            )
        )
    );
}