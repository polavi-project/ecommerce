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
        if (items.length == 0) return null;
        return React.createElement(
            "ul",
            { className: "list-unstyled" },
            items.map((r, i) => {
                return React.createElement(
                    "li",
                    { key: i, className: "nav-item" },
                    React.createElement(
                        A,
                        { url: r.url },
                        r.icon && React.createElement("i", { className: "fas fa-" + r.icon }),
                        r.title
                    ),
                    renderChildren(r.id)
                );
            })
        );
    };
    let rootItems = getRootItems();
    return React.createElement(
        "ul",
        { className: "list-unstyled" },
        rootItems.map((r, i) => {
            return React.createElement(
                "li",
                { key: i, className: "nav-item" },
                r.url && React.createElement(
                    A,
                    { url: r.url, className: "root-label" },
                    r.icon && React.createElement("i", { className: "fas fa-" + r.icon }),
                    r.title
                ),
                !r.url && React.createElement(
                    "span",
                    { className: "root-label" },
                    r.icon && React.createElement("i", { className: "fas fa-" + r.icon }),
                    r.title
                ),
                renderChildren(r.id)
            );
        })
    );
}