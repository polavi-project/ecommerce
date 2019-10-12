import Area from "../../../../../../../../js/production/area.js";

function Title() {
    return React.createElement(
        "h3",
        null,
        "Shipping methods"
    );
}

function NoMethod({ areaProps }) {
    if (areaProps.noMethod === false) return null;
    const shippingAddress = ReactRedux.useSelector(state => _.get(state, 'appState.cart.shippingAddress'));
    if (shippingAddress) return React.createElement(
        "div",
        { className: "no-shipping-method" },
        React.createElement(
            "span",
            null,
            "Sorry. There is no shipping method available."
        )
    );else return React.createElement(
        "div",
        { className: "no-shipping-method" },
        React.createElement(
            "span",
            null,
            "Please provide shipping address first."
        )
    );
}

export default function ShippingMethods() {
    const [noMethod, setNoMethod] = React.useState(true);
    return React.createElement(Area, {
        id: "checkout_shipping_method_block",
        className: "uk-width-1-1 checkout-shipping-methods",
        noMethod: noMethod,
        setNoMethod: setNoMethod,
        coreWidgets: [{
            component: Title,
            props: {},
            sort_order: 0,
            id: "shipping_method_block_title"
        }, {
            component: NoMethod,
            props: {},
            sort_order: 100,
            id: "shipping_no_method"
        }]
    });
}