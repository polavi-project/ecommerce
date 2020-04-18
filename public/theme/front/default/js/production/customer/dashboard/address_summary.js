export default function AddressSummary({ address }) {
    return React.createElement(
        "div",
        { className: "address-summary" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "strong",
                null,
                address.full_name
            )
        ),
        React.createElement(
            "div",
            null,
            address.address_1
        ),
        React.createElement(
            "div",
            null,
            address.address_2
        ),
        React.createElement(
            "div",
            null,
            address.city,
            ", ",
            address.province,
            ", ",
            address.postcode
        ),
        React.createElement(
            "div",
            null,
            address.country
        ),
        React.createElement(
            "div",
            null,
            React.createElement(
                "span",
                null,
                "Phone"
            ),
            ": ",
            address.telephone
        )
    );
}