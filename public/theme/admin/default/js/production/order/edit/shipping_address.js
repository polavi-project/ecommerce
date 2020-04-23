import AddressSummary from "../../../../../../front/default/js/production/customer/address/address_summary.js";

export default function ShippingAddress({ address }) {
    return React.createElement(
        "div",
        { className: "sml-block mt-4" },
        React.createElement(
            "div",
            { className: "sml-block-title" },
            "Shipping address"
        ),
        React.createElement(AddressSummary, { address: address })
    );
}