import A from "../../../../../../../../js/production/a.js";

export default function SuccessMessage({ message, homeUrl }) {
    return React.createElement(
        "div",
        { className: "order-success-message" },
        React.createElement(
            "div",
            { className: "w-100" },
            React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "mb-4" },
                    React.createElement(
                        "h4",
                        null,
                        message
                    )
                ),
                React.createElement(A, { text: "Home page", url: homeUrl, className: "btn btn-primary" })
            )
        )
    );
}