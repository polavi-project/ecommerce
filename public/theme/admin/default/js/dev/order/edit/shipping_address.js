import AddressSummary from "../../../../../../front/default/js/production/customer/address/address_summary.js";

export default function ShippingAddress({address}) {
    return <div className="sml-block mt-4">
        <div className="sml-block-title">Shipping address</div>
        <AddressSummary address={address}/>
    </div>
}