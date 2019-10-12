import A from "../../../../../../js/production/a.js";

export default function Navigation(props) {
    return React.createElement(
        "nav",
        { className: "uk-navbar-container uk-navbar-transparent", "uk-navbar": "mode: hover" },
        React.createElement(
            "div",
            { className: "uk-navbar-left" },
            React.createElement(
                "ul",
                { className: "uk-navbar-nav" },
                props.items.map((i, index) => {
                    return React.createElement(
                        "li",
                        { key: index },
                        React.createElement(A, { url: i.url, text: i.name })
                    );
                })
            )
        )
    );
}