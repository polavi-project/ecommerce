import Area from "../../../../../../../../js/production/area.js";

function Title() {
    return React.createElement(
        'h3',
        null,
        'Delivery to'
    );
}

function ShippingAddress({ areaProps }) {
    const shippingAddress = ReactRedux.useSelector(state => _.get(state, 'appState.cart.shippingAddress'));

    const onClick = e => {
        e.preventDefault();
        areaProps.setNeedSelectAddress(true);
    };
    if (!shippingAddress || areaProps.needSelectAddress === true) return null;else return React.createElement(
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

    const [needSelectAddress, setNeedSelectAddress] = React.useState(shippingAddress !== null);

    return React.createElement(
        'div',
        { className: 'checkout-shipping-address' },
        React.createElement(Area, {
            id: "checkout_shipping_address_block",
            className: 'uk-width-1-1',
            needSelectAddress: needSelectAddress,
            setNeedSelectAddress: setNeedSelectAddress,
            coreWidgets: [{
                component: Title,
                props: {},
                sort_order: 0,
                id: "shipping_address_block_title"
            }, {
                'component': ShippingAddress,
                'props': {},
                'sort_order': 10,
                'id': 'shipment_address'
            }]
        })
    );
}

export { ShippingAddressBlock };