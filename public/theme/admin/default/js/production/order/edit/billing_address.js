import AddressSummary from "../../../../../../front/default/js/production/customer/address/address_summary.js";

export default function BillingAddress({ address }) {
    return React.createElement(
        "div",
        { className: "sml-block" },
        React.createElement(
            "div",
            { className: "sml-block-title" },
            "Billing address"
        ),
        React.createElement(AddressSummary, { address: address })
    );
}