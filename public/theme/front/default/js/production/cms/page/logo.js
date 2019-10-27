import A from "../../../../../../../js/production/a.js";

export default function Logo({ homeUrl, logoUrl, storeName, logoWidth, logoHeight }) {
    return React.createElement(
        "div",
        { className: "logo" },
        logoUrl && React.createElement(
            A,
            { url: homeUrl },
            React.createElement("img", { src: logoUrl, alt: storeName, style: { width: logoWidth + 'px', height: logoHeight + 'px' } })
        ),
        !logoUrl && React.createElement(
            A,
            { url: homeUrl },
            React.createElement(
                "span",
                null,
                storeName
            )
        )
    );
}