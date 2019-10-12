import Area from "../../../../../../../../js/production/area.js";

function Title() {
    return <h3>Delivery to</h3>
}

function ShippingAddress({areaProps}) {
    const shippingAddress = ReactRedux.useSelector(state => _.get(state, 'appState.cart.shippingAddress'));

    const onClick = (e) => {
        e.preventDefault();
        areaProps.setNeedSelectAddress(true);
    };
    if(!shippingAddress || areaProps.needSelectAddress === true)
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

    const [needSelectAddress, setNeedSelectAddress] = React.useState(shippingAddress !== null);

    return <div className="checkout-shipping-address">
        <Area
            id={"checkout_shipping_address_block"}
            className="uk-width-1-1"
            needSelectAddress={needSelectAddress}
            setNeedSelectAddress={setNeedSelectAddress}
            coreWidgets={[
                {
                    component: Title,
                    props : {},
                    sort_order: 0,
                    id: "shipping_address_block_title"
                },
                {
                    'component': ShippingAddress,
                    'props': {},
                    'sort_order': 10,
                    'id': 'shipment_address'
                }
            ]}
        />
    </div>
}

export {ShippingAddressBlock}
