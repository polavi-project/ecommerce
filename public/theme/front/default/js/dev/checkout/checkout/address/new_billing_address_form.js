import {ADD_ALERT, ADD_APP_STATE} from "../../../../../../../../js/production/event-types.js";
import AddressForm from "../../../../production/customer/account/address.js";

export default function BillingAddressForm(props) {
    const dispatch = ReactRedux.useDispatch();
    const onComplete = (response) => {
        if(_.get(response, 'payload.data.addBillingAddress.status') === true) {
            let address = _.get(response, 'payload.data.addBillingAddress.address');
            let setAddresses = _.get(props, 'setAddresses');
            setAddresses(()=> {
                let flag = false;
                let newAddress = _.get(props, 'addresses').map((a, i) => {
                    if(a.customer_address_id === address.customer_address_id) {
                        flag = true;
                        a = {...address, used: true};
                    }
                    return a;
                });
                if(flag === false)
                    newAddress = newAddress.concat({...address, used: true});

                return newAddress;
            });
            _.get(props, 'setShowForm')(false);
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
        } else {
            dispatch({'type' : ADD_ALERT, 'payload': {alerts: [{id: "checkout_billing_address_error", message: _.get(response, 'payload.data.addBillingAddress.message'), type: "error"}]}});
        }
    };

    const onError = () => {
        dispatch({'type' : ADD_ALERT, 'payload': {alerts: [{id: "checkout_billing_address_error", message: 'Something wrong. Please try again', type: "error"}]}});
    };

    return <div className="uk-width-1-1">
        <h3>New address</h3>
        <AddressForm
            action={_.get(props, 'action')}
            countries={_.get(props, 'countries')}
            onComplete={onComplete}
            onError={onError}
        />
    </div>
}