import A from "./a.js";

export default function Navigation(props) {
    const getRootItems = () => {
        let result = props.items.filter(item => item.parent_id === null);
        result.sort((a, b) => {
            return a.sort_order - b.sort_order;
        });

        return result;
    };

    const getChildrenItems = id => {
        let result = props.items.filter(item => item.parent_id === id);
        result.sort((a, b) => {
            return a.sort_order - b.sort_order;
        });
        return result;
    };

    const renderChildren = id => {
        let items = getChildrenItems(id);
        return React.createElement(
            "ul",
            { className: "uk-nav-sub" },
            items.map((r, i) => {
                return React.createElement(
                    "li",
                    { key: i, className: "uk-parent" },
                    React.createElement(
                        A,
                        { url: r.url },
                        r.icon && React.createElement("span", { className: "uk-margin-small-right", "uk-icon": "icon: " + r.icon + "; ratio: 1" }),
                        r.title
                    ),
                    renderChildren(r.id)
                );
            })
        );
    };
    let rootItems = getRootItems();
    return React.createElement(
        "div",
        null,
        React.createElement(
            "ul",
            { className: "uk-nav-default uk-nav-parent-icon", "uk-nav": "multiple: true" },
            rootItems.map((r, i) => {
                return React.createElement(
                    "li",
                    { key: i, className: "uk-parent" },
                    React.createElement(
                        A,
                        { url: r.url },
                        r.icon && React.createElement("span", { className: "uk-margin-small-right", "uk-icon": "icon: " + r.icon + "; ratio: 1" }),
                        r.title
                    ),
                    renderChildren(r.id)
                );
            })
        )
    );
}