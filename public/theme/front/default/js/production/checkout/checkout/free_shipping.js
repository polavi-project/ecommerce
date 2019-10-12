export default function FreeShipping({ label, description, price }) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "label",
            { htmlFor: "free-shipping" },
            label,
            " ",
            price,
            React.createElement(
                "p",
                null,
                description
            ),
            React.createElement("input", { type: "radio", name: "shipping_method", id: "free-shipping", value: "free_shipping" })
        )
    );
}