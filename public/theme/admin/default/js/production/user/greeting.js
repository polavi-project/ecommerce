export default function AdminUserGreeting({ fullName, logoutUrl }) {
    return React.createElement(
        "div",
        { className: "admin-user-greeting" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "span",
                null,
                "Hello"
            ),
            " ",
            React.createElement(
                "span",
                { className: "user-name" },
                fullName
            ),
            "! ",
            React.createElement(
                "a",
                { href: logoutUrl },
                React.createElement(
                    "span",
                    null,
                    "Logout"
                )
            )
        )
    );
}