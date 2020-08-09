import A from "../../../../../../../js/production/a.js";

export default function Menu({ items = [] }) {
    return React.createElement(
        "div",
        { className: "main-menu" },
        React.createElement(
            "ul",
            { className: "nav justify-content-center" },
            items.map((i, k) => {
                return React.createElement(
                    "li",
                    { key: k, className: "nav-item" },
                    React.createElement(A, { className: "nav-link", url: i.url, text: i.label })
                );
            })
        )
    );
}