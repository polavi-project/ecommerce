import Area from "../../../../../../../../js/production/area.js";
import {Fetch} from "../../../../../../../../js/production/fetch.js";
import {ADD_ALERT, ADD_APP_STATE} from "../../../../../../../../js/production/event-types.js";

function Title() {
    return <div><strong>Billing address</strong></div>
}

function BillingAddress({needSelectAddress, setNeedSelectAddress}) {
    const billingAddress = ReactRedux.useSelector(state => _.get(state, 'appState.cart.billingAddress'));

    const onClick = (e) => {
        e.preventDefault();
        setNeedSelectAddress(true);
    };
    if(!billingAddress || needSelectAddress === true)
        return null;
    else
        return <div className='checkout-shipping-address'>
            <div><strong>{billingAddress.full_name}</strong></div>
            <div>{billingAddress.address_1}</div>
            <div>{billingAddress.address_2}</div>
            <div>{billingAddress.city}, {billingAddress.province}, {billingAddress.postcode}</div>
            <div>{billingAddress.country}</div>
            <div><span>Phone</span>: {billingAddress.telephone}</div>
            <a href="#" onClick={(e) => onClick(e)}><span uk-icon="icon: location; ratio: 1"></span> Change</a>
        </div>
}

function UseShippingOrAnother({needSelectAddress, setNeedSelectAddress}) {
    const billingAddress = ReactRedux.useSelector(state => _.get(state, 'appState.cart.billingAddress'));
    const graphqlApi = ReactRedux.useSelector(state => _.get(state, 'appState.graphqlApi'));
    const cart = ReactRedux.useSelector(state => _.get(state, 'appState.cart'));
    const cartId = ReactRedux.useSelector(state => _.get(state, 'appState.cart.cartId'));
    const dispatch = ReactRedux.useDispatch();

    const set$UseShippping = (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('query', `mutation  { addBillingAddress (address: null, cartId: ${cartId}) {status message}}`);
        Fetch(
            graphqlApi,
            false,
            'POST',
            formData,
            null,
            (response) => {
                if(_.get(response, 'payload.data.addBillingAddress.status') === true) {
                    setNeedSelectAddress(false);
                    dispatch({
                        'type' : ADD_APP_STATE,
                        'payload': {
                            'appState': {
                                'cart': {
                                    ...cart,
                                    'billingAddress': false
                                }
                            }
                        }
                    });
                } else {
                    dispatch({'type' : ADD_ALERT, 'payload': {alerts: [{id: `checkout_billing_address_error`, message: _.get(response, 'payload.data.addBillingAddress.message', "Something wrong. Please try again"), type: "error"}]}});
                }
            },
            () => {
                dispatch({'type' : ADD_ALERT, 'payload': {alerts: [{id: `checkout_billing_address_error`, message: 'Something wrong. Please try again', type: "error"}]}});
            });
    };
    return <div className="checkout-billing-address-use-shipping">
        <div>
            <div><label><input onChange={(e) => {set$UseShippping(e)}} type="radio" className="uk-radio" checked={billingAddress === false && needSelectAddress === false}/> Use shipping address</label></div>
            <div><label><input onChange={(e) => {setNeedSelectAddress(true);}} type="radio" className="uk-radio" checked={billingAddress !== false || needSelectAddress === true}/> Use another address</label></div>
        </div>
    </div>
}

function BillingAddressBlock() {
    const [needSelectAddress, setNeedSelectAddress] = React.useState(false);

    return <div className="checkout-billing-address">
        <Area
            id={"checkout_billing_address_block"}
            className="uk-width-1-1"
            needSelectAddress={needSelectAddress}
            setNeedSelectAddress={setNeedSelectAddress}
            coreWidgets={[
                {
                    component: Title,
                    props : {},
                    sort_order: 0,
                    id: "billing_address_block_title"
                },
                {
                    component: UseShippingOrAnother,
                    props : {needSelectAddress, setNeedSelectAddress},
                    sort_order: 10,
                    id: "billing_address_block_use_shipping"
                },
                {
                    'component': BillingAddress,
                    'props': {needSelectAddress, setNeedSelectAddress},
                    'sort_order': 20,
                    'id': 'billing_address'
                }
            ]}
        />
    </div>
}

export {BillingAddressBlock}
