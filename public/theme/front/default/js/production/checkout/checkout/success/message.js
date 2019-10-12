export default function SuccessMessage({ message }) {
    return React.createElement(
        "div",
        { className: "order-success-message" },
        React.createElement(
            "p",
            null,
            message
        )
    );
}