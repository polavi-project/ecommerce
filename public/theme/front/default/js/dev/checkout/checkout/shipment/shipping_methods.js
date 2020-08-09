import Area from "../../../../../../../../js/production/area.js";

function Title() {
    return <div><strong>Shipping methods</strong></div>
}

function NoMethod({areaProps}) {
    if(areaProps.noMethod === false)
        return null;
    const shippingAddress = ReactRedux.useSelector(state => _.get(state, 'appState.cart.shippingAddress'));
    if(shippingAddress)
        return <div className="no-shipping-method">
            <span>Sorry. There is no shipping method available.</span>
        </div>;
    else
        return <div className="no-shipping-method">
            <span>Please provide shipping address first.</span>
        </div>;
}

export default function ShippingMethods() {
    const [noMethod, setNoMethod] = React.useState(true);
    return <Area
        id="checkout_shipping_method_block"
        className="checkout-shipping-methods"
        noMethod={noMethod}
        setNoMethod={setNoMethod}
        coreWidgets={[
            {
                component: Title,
                props : {},
                sort_order: 0,
                id: "shipping_method_block_title"
            },
            {
                component: NoMethod,
                props : {},
                sort_order: 100,
                id: "shipping_no_method"
            }
        ]}
    />
}