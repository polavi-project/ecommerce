import AddressSummary from "../../../../../../front/default/js/production/customer/address/address_summary.js";

export default function BillingAddress({address}) {
    return <div className="sml-block">
        <div className="sml-block-title">Billing address</div>
        <AddressSummary address={address}/>
    </div>
}