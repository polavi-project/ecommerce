import A from "../../../../../../../js/production/a.js";

export default function Menu({ items = [] }) {
    return React.createElement(
        "div",
        { className: "main-menu" },
        React.createElement(
            "nav",
            { className: "uk-navbar-container uk-navbar-transparent uk-navbar" },
            React.createElement(
                "div",
                { className: "uk-navbar-left" },
                React.createElement(
                    "ul",
                    { className: "uk-navbar-nav" },
                    items.map((i, k) => {
                        return React.createElement(
                            "li",
                            { key: k },
                            React.createElement(A, { url: i.url, text: i.label })
                        );
                    })
                )
            )
        )
    );
}