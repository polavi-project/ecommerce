import Area from "../../../../../../../../js/production/area.js";

function Title() {
    return React.createElement(
        'h3',
        null,
        'Billing address'
    );
}

function BillingAddress({ areaProps }) {
    const billingAddress = ReactRedux.useSelector(state => _.get(state, 'appState.cart.billingAddress'));

    const onClick = e => {
        e.preventDefault();
        areaProps.setNeedSelectAddress(true);
    };
    if (!billingAddress || areaProps.needSelectAddress === true) return null;else return React.createElement(
        'div',
        { className: 'checkout-shipping-address' },
        React.createElement(
            'div',
            null,
            React.createElement(
                'strong',
                null,
                billingAddress.full_name
            )
        ),
        React.createElement(
            'div',
            null,
            billingAddress.address_1
        ),
        React.createElement(
            'div',
            null,
            billingAddress.address_2
        ),
        React.createElement(
            'div',
            null,
            billingAddress.city,
            ', ',
            billingAddress.province,
            ', ',
            billingAddress.postcode
        ),
        React.createElement(
            'div',
            null,
            billingAddress.country
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
            billingAddress.telephone
        ),
        React.createElement(
            'a',
            { href: '#', onClick: e => onClick(e) },
            React.createElement('span', { 'uk-icon': 'icon: location; ratio: 1' }),
            ' Change'
        )
    );
}

function BillingAddressBlock() {
    const billingAddress = ReactRedux.useSelector(state => _.get(state, 'appState.cart.billingAddress'));

    const [needSelectAddress, setNeedSelectAddress] = React.useState(billingAddress !== null);

    return React.createElement(
        'div',
        { className: 'checkout-shipping-address' },
        React.createElement(Area, {
            id: "checkout_billing_address_block",
            className: 'uk-width-1-1',
            needSelectAddress: needSelectAddress,
            setNeedSelectAddress: setNeedSelectAddress,
            coreWidgets: [{
                component: Title,
                props: {},
                sort_order: 0,
                id: "billing_address_block_title"
            }, {
                'component': BillingAddress,
                'props': {},
                'sort_order': 10,
                'id': 'billing_address'
            }]
        })
    );
}

export { BillingAddressBlock };