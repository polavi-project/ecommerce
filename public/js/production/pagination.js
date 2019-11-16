export default function Pagination({ total, limit, current }) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "ul",
            { className: "pagination" },
            React.createElement(
                "li",
                { className: "prev" },
                React.createElement(
                    "a",
                    { href: "#" },
                    React.createElement(
                        "span",
                        null,
                        "Previous"
                    )
                )
            ),
            React.createElement("li", { className: "first" }),
            React.createElement("li", { className: "current" }),
            React.createElement("li", { className: "last" }),
            React.createElement(
                "li",
                { className: "next" },
                React.createElement(
                    "a",
                    { href: "#" },
                    React.createElement(
                        "span",
                        null,
                        "Next"
                    )
                )
            )
        )
    );
}