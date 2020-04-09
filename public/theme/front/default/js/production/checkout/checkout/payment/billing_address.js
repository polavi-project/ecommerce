import Area from "../../../../../../../../js/production/area.js";
import AddressSummary from "../../../customer/dashboard/address_summary.js";

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
        React.createElement(AddressSummary, { address: billingAddress }),
        React.createElement(
            "a",
            { href: "#", onClick: e => onClick(e) },
            React.createElement("span", { "uk-icon": "icon: location; ratio: 1" }),
            " Change"
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
                'component': BillingAddress,
                'props': { needSelectAddress, setNeedSelectAddress },
                'sort_order': 20,
                'id': 'billing_address'
            }]
        })
    );
}

export { BillingAddressBlock };