import A from "../../../../../../../js/production/a.js";

export default function Logo({ adminUrl, logoUrl, storeName, logoWidth, logoHeight }) {
    return React.createElement(
        "div",
        { className: "logo" },
        logoUrl && React.createElement(
            A,
            { url: adminUrl },
            React.createElement("img", { src: logoUrl, alt: storeName, title: storeName, style: { width: logoWidth + 'px', height: logoHeight + 'px' } })
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