export default function Cod({ label }) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "label",
            { htmlFor: "cod-payment-method" },
            label,
            React.createElement("input", { type: "radio", name: "payment_method", id: "cod-payment-method", value: "cod" })
        )
    );
}