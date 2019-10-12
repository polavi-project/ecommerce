import Area from "../../../../../../../../js/production/area.js";

function Title() {
    return <h3>Billing address</h3>
}

function BillingAddress({areaProps}) {
    const billingAddress = ReactRedux.useSelector(state => _.get(state, 'appState.cart.billingAddress'));

    const onClick = (e) => {
        e.preventDefault();
        areaProps.setNeedSelectAddress(true);
    };
    if(!billingAddress || areaProps.needSelectAddress === true)
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

function BillingAddressBlock() {
    const billingAddress = ReactRedux.useSelector(state => _.get(state, 'appState.cart.billingAddress'));

    const [needSelectAddress, setNeedSelectAddress] = React.useState(billingAddress !== null);

    return <div className="checkout-shipping-address">
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
                    'component': BillingAddress,
                    'props': {},
                    'sort_order': 10,
                    'id': 'billing_address'
                }
            ]}
        />
    </div>
}

export {BillingAddressBlock}
