import A from "../../../../../../../js/production/a.js";

export default function BreadcrumbsWidget({ id, items }) {
    items.sort((a, b) => parseInt(a.sort_order) - parseInt(b.sort_order));
    return React.createElement(
        "div",
        { className: "breadcrumbs" },
        React.createElement(
            "ul",
            null,
            items.map((i, k) => {
                return React.createElement(
                    "li",
                    { key: k },
                    i.link !== null ? React.createElement(A, { url: i.link, text: i.title }) : React.createElement(
                        "span",
                        null,
                        i.title
                    )
                );
            })
        )
    );
}