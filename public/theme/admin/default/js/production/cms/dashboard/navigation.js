import A from "../../../../../../../js/production/a.js";
import Navigation from "../../../../../../../js/production/navigation.js";

function Logo({ adminUrl, logoUrl, storeName }) {
    return React.createElement(
        "div",
        { className: "logo" },
        logoUrl && React.createElement(
            A,
            { url: adminUrl },
            React.createElement("img", { src: logoUrl, alt: storeName, title: storeName })
        ),
        !logoUrl && React.createElement(
            A,
            { url: adminUrl },
            React.createElement(
                "span",
                null,
                storeName
            )
        )
    );
}

export default function AdminNavigation(props) {
    return React.createElement(
        "div",
        { className: "admin-nav-container" },
        React.createElement(
            "div",
            { className: "top-bar" },
            React.createElement(Logo, { adminUrl: props.adminUrl, logoUrl: props.logoUrl, storeName: props.storeName }),
            React.createElement(
                "a",
                { className: "menu-toggle", href: "javascript:void(0)" },
                React.createElement("i", { className: "fas fa-list" })
            )
        ),
        React.createElement(
            "div",
            { className: "admin-nav", "data-simplebar": "true", "data-simplebar-auto-hide": "false" },
            React.createElement(Navigation, { items: props.items })
        )
    );
}