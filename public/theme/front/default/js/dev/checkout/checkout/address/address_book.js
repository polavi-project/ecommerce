import {ADD_ALERT, ADD_APP_STATE} from "../../../../../../../../js/production/event-types.js";
import {Fetch} from "../../../../../../../../js/production/fetch.js";

function Address({address, cartId, addressType = 'shipping', action, setNeedSelectAddress}) {
    const dispatch = ReactRedux.useDispatch();
    const onComplete = (response) => {
        let path = addressType === 'shipping' ? 'payload.data.addShippingAddress' : 'payload.data.addBillingAddress';
        if(_.get(response, path + '.status') === true) {
            setNeedSelectAddress(false);
            if(addressType === 'shipping')
                dispatch({
                    'type' : ADD_APP_STATE,
                    'payload': {
                        'appState': {
                            'cart': {
                                'shippingAddress': address
                            }
                        }
                    }
                });
            else
                dispatch({
                    'type' : ADD_APP_STATE,
                    'payload': {
                        'appState': {
                            'cart': {
                                'billingAddress': address
                            }
                        }
                    }
                });
        } else {
            dispatch({'type' : ADD_ALERT, 'payload': {alerts: [{id: `checkout_${addressType}_address_error`, message: _.get(response, path + '.message'), type: "error"}]}});
        }
    };

    const onError = () => {
        dispatch({'type' : ADD_ALERT, 'payload': {alerts: [{id: `checkout_${addressType}_address_error`, message: 'Something wrong. Please try again', type: "error"}]}});
    };

    const onClick = (e) => {
        e.preventDefault();
        let formData = new FormData();
        for (let key in address) {
            if (address.hasOwnProperty(key)) {
                if(address[key] !== null && key !== 'customer_address_id')
                    formData.append(`variables[address][${key}]`, address[key]);
            }
        }
        formData.append(`variables[cartId]`, cartId);
        if(addressType === 'shipping')
            formData.append('query', "mutation AddShippingAddress($address: CustomerAddressInput!, $cartId: Int!) { addShippingAddress (address: $address, cartId: $cartId) {status message address {customer_address_id}}}");
        if(addressType === 'billing')
            formData.append('query', "mutation AddBillingAddress($address: CustomerAddressInput!, $cartId: Int!) { addBillingAddress (address: $address, cartId: $cartId) {status message address {customer_address_id}}}");
        Fetch(action, false, 'POST', formData, null, onComplete, onError);
    };

    return <div className='uk-width-1-2 checkout-shipping-address'>
        <div><strong>{address.full_name}</strong></div>
        <div>{address.address_1}</div>
        <div>{address.address_2}</div>
        <div>{address.city}, {address.province}, {address.postcode}</div>
        <div>{address.country}</div>
        <div><span>Phone</span>: {address.telephone}</div>
        <a href="#" onClick={(e) => onClick(e)}><span uk-icon="icon: location; ratio: 1"></span> Use this address</a>
    </div>
}

export default function CheckoutAddressBook({addresses = [], cartId, addressType = 'shipping', action, areaProps}) {
    if(addresses.length === 0 || areaProps.needSelectAddress === false)
        return null;

    return <div className="checkout-address-book">
        <h3>Address book</h3>
        {addresses.map((a, i) => {
            return <Address
                address={a}
                key={i}
                cartId={cartId}
                addressType={addressType}
                action={action}
                setNeedSelectAddress={areaProps.setNeedSelectAddress}
            />
        })}
    </div>
}