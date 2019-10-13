import Area from "../../../../../../../../js/production/area.js";

function ShippingAddress({needSelectAddress, setNeedSelectAddress}) {
    const shippingAddress = ReactRedux.useSelector(state => _.get(state, 'appState.cart.shippingAddress'));

    const onClick = (e) => {
        e.preventDefault();
        setNeedSelectAddress(true);
    };
    if(!shippingAddress || needSelectAddress === true)
        return null;
    else
        return <div className='checkout-shipping-address'>
            <div><strong>{shippingAddress.full_name}</strong></div>
            <div>{shippingAddress.address_1}</div>
            <div>{shippingAddress.address_2}</div>
            <div>{shippingAddress.city}, {shippingAddress.province}, {shippingAddress.postcode}</div>
            <div>{shippingAddress.country}</div>
            <div><span>Phone</span>: {shippingAddress.telephone}</div>
            <a href="#" onClick={(e) => onClick(e)}><span uk-icon="icon: location; ratio: 1"></span> Change</a>
        </div>
}

function ShippingAddressBlock() {
    const shippingAddress = ReactRedux.useSelector(state => _.get(state, 'appState.cart.shippingAddress'));

    const [needSelectAddress, setNeedSelectAddress] = React.useState(shippingAddress === false);

    return <div className="checkout-shipping-address">
        <Area
            id={"checkout_shipping_address_block"}
            className="uk-width-1-1"
            needSelectAddress={needSelectAddress}
            setNeedSelectAddress={setNeedSelectAddress}
            coreWidgets={[
                {
                    'component': ShippingAddress,
                    'props': {needSelectAddress, setNeedSelectAddress},
                    'sort_order': 0,
                    'id': 'shipment_address'
                }
            ]}
        />
    </div>
}

export {ShippingAddressBlock}
