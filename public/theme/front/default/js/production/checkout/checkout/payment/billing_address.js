var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Area from "../../../../../../../../js/production/area.js";
import { Fetch } from "../../../../../../../../js/production/fetch.js";
import { ADD_ALERT, ADD_APP_STATE } from "../../../../../../../../js/production/event-types.js";

function Title() {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "strong",
            null,
            "Billing address"
        )
    );
}

function BillingAddress({ needSelectAddress, setNeedSelectAddress }) {
    const billingAddress = ReactRedux.useSelector(state => _.get(state, 'appState.cart.billingAddress'));

    const onClick = e => {
        e.preventDefault();
        setNeedSelectAddress(true);
    };
    if (!billingAddress || needSelectAddress === true) return null;else return React.createElement(
        "div",
        { className: "checkout-shipping-address" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "strong",
                null,
                billingAddress.full_name
            )
        ),
        React.createElement(
            "div",
            null,
            billingAddress.address_1
        ),
        React.createElement(
            "div",
            null,
            billingAddress.address_2
        ),
        React.createElement(
            "div",
            null,
            billingAddress.city,
            ", ",
            billingAddress.province,
            ", ",
            billingAddress.postcode
        ),
        React.createElement(
            "div",
            null,
            billingAddress.country
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
            billingAddress.telephone
        ),
        React.createElement(
            "a",
            { href: "#", onClick: e => onClick(e) },
            React.createElement("span", { "uk-icon": "icon: location; ratio: 1" }),
            " Change"
        )
    );
}

function UseShippingOrAnother({ needSelectAddress, setNeedSelectAddress }) {
    const billingAddress = ReactRedux.useSelector(state => _.get(state, 'appState.cart.billingAddress'));
    const graphqlApi = ReactRedux.useSelector(state => _.get(state, 'appState.graphqlApi'));
    const cart = ReactRedux.useSelector(state => _.get(state, 'appState.cart'));
    const cartId = ReactRedux.useSelector(state => _.get(state, 'appState.cart.cartId'));
    const dispatch = ReactRedux.useDispatch();

    const set$UseShippping = e => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('query', `mutation  { addBillingAddress (address: null, cartId: ${cartId}) {status message}}`);
        Fetch(graphqlApi, false, 'POST', formData, null, response => {
            if (_.get(response, 'payload.data.addBillingAddress.status') === true) {
                setNeedSelectAddress(false);
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
                dispatch({ 'type': ADD_ALERT, 'payload': { alerts: [{ id: `checkout_billing_address_error`, message: _.get(response, 'payload.data.addBillingAddress.message', "Something wrong. Please try again"), type: "error" }] } });
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
                        }, type: "radio", className: "uk-radio", checked: billingAddress === false && needSelectAddress === false }),
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
                            setNeedSelectAddress(true);
                        }, type: "radio", className: "uk-radio", checked: billingAddress !== false || needSelectAddress === true }),
                    " Use another address"
                )
            )
        )
    );
}

function BillingAddressBlock() {
    const [needSelectAddress, setNeedSelectAddress] = React.useState(false);

    return React.createElement(
        "div",
        { className: "checkout-billing-address" },
        React.createElement(Area, {
            id: "checkout_billing_address_block",
            className: "uk-width-1-1",
            needSelectAddress: needSelectAddress,
            setNeedSelectAddress: setNeedSelectAddress,
            coreWidgets: [{
                component: Title,
                props: {},
                sort_order: 0,
                id: "billing_address_block_title"
            }, {
                component: UseShippingOrAnother,
                props: { needSelectAddress, setNeedSelectAddress },
                sort_order: 10,
                id: "billing_address_block_use_shipping"
            }, {
                'component': BillingAddress,
                'props': { needSelectAddress, setNeedSelectAddress },
                'sort_order': 20,
                'id': 'billing_address'
            }]
        })
    );
}

export { BillingAddressBlock };