import Area from "../../../../../../../../js/production/area.js";

function ShippingAddress({ needSelectAddress, setNeedSelectAddress }) {
    const shippingAddress = ReactRedux.useSelector(state => _.get(state, 'appState.cart.shippingAddress'));

    const onClick = e => {
        e.preventDefault();
        setNeedSelectAddress(true);
    };
    if (!shippingAddress || needSelectAddress === true) return null;else return React.createElement(
        'div',
        { className: 'checkout-shipping-address' },
        React.createElement(
            'div',
            null,
            React.createElement(
                'strong',
                null,
                shippingAddress.full_name
            )
        ),
        React.createElement(
            'div',
            null,
            shippingAddress.address_1
        ),
        React.createElement(
            'div',
            null,
            shippingAddress.address_2
        ),
        React.createElement(
            'div',
            null,
            shippingAddress.city,
            ', ',
            shippingAddress.province,
            ', ',
            shippingAddress.postcode
        ),
        React.createElement(
            'div',
            null,
            shippingAddress.country
        ),
        React.createElement(
            'div',
            null,
            React.createElement(
                'span',
                null,
                'Phone'
            ),
            ': ',
            shippingAddress.telephone
        ),
        React.createElement(
            'a',
            { href: '#', onClick: e => onClick(e) },
            React.createElement('span', { 'uk-icon': 'icon: location; ratio: 1' }),
            ' Change'
        )
    );
}

function ShippingAddressBlock() {
    const shippingAddress = ReactRedux.useSelector(state => _.get(state, 'appState.cart.shippingAddress'));

    const [needSelectAddress, setNeedSelectAddress] = React.useState(shippingAddress === false);

    return React.createElement(
        'div',
        { className: 'checkout-shipping-address' },
        React.createElement(Area, {
            id: "checkout_shipping_address_block",
            className: 'uk-width-1-1',
            needSelectAddress: needSelectAddress,
            setNeedSelectAddress: setNeedSelectAddress,
            coreWidgets: [{
                'component': ShippingAddress,
                'props': { needSelectAddress, setNeedSelectAddress },
                'sort_order': 0,
                'id': 'shipment_address'
            }]
        })
    );
}

export { ShippingAddressBlock };