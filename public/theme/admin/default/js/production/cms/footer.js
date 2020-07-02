export default function Footer() {
    return React.createElement(
        "div",
        { className: "footer" },
        React.createElement(
            "div",
            { className: "copyright" },
            React.createElement(
                "span",
                null,
                "Copyright \xA9 2020 Polavi Commerce"
            )
        ),
        React.createElement(
            "div",
            { className: "version" },
            React.createElement(
                "span",
                null,
                "Version 1.0 dev"
            )
        )
    );
}