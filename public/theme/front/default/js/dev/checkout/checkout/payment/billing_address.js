import Area from "../../../../../../../../js/production/area.js";
import AddressSummary from "../../../customer/address/address_summary.js";

function Title() {
    return <div><strong>Billing address</strong></div>
}

function BillingAddress({needSelectAddress, setNeedSelectAddress}) {
    const billingAddress = ReactRedux.useSelector(state => _.get(state, 'appState.cart.billingAddress'));

    const onClick = (e) => {
        e.preventDefault();
        setNeedSelectAddress(true);
    };
    if(!billingAddress || needSelectAddress === true)
        return null;
    else
        return <div className='checkout-shipping-address'>
            <AddressSummary address={billingAddress}/>
            <a href="#" onClick={(e) => onClick(e)}><span uk-icon="icon: location; ratio: 1"></span> Change</a>
        </div>
}

function BillingAddressBlock() {
    const [needSelectAddress, setNeedSelectAddress] = React.useState(false);

    return <div className="checkout-billing-address">
        <Area
            id={"checkout_billing_address_block"}
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
                    'props': {needSelectAddress, setNeedSelectAddress},
                    'sort_order': 20,
                    'id': 'billing_address'
                }
            ]}
        />
    </div>
}

export {BillingAddressBlock}
