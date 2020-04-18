export default function AdminUserGreeting({ fullName, logoutUrl, time }) {
    return React.createElement(
        "div",
        { className: "admin-user-greeting" },
        React.createElement(
            "div",
            null,
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
                "!"
            ),
            React.createElement(
                "i",
                { className: "time" },
                time
            )
        ),
        React.createElement(
            "div",
            null,
            React.createElement(
                "a",
                { href: logoutUrl, className: "logout" },
                React.createElement(
                    "span",
                    null,
                    "Logout"
                ),
                React.createElement("i", { className: "fas fa-sign-out-alt" })
            )
        )
    );
}