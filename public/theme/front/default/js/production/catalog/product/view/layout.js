import Area from "../../../../../../../../js/production/area.js";

function Tab() {
    return React.createElement(Area, {
        id: "product_detail_tab",
        wrapper: "ul",
        className: "uk-accordion",
        wrapperProps: {
            "uk-accordion": "true"
        }

    });
}

export default function ProductPageLayout() {
    return React.createElement(
        "div",
        { className: "uk-grid-small uk-grid" },
        React.createElement(Area, {
            id: "product_page_top",
            className: "product-page-top"
        }),
        React.createElement(
            "div",
            { className: "product-page-middle uk-grid uk-grid-small uk-width-1-1" },
            React.createElement(Area, {
                id: "product_page_middle_left",
                className: "uk-width-1-2@m product-page-middle-left"
            }),
            React.createElement(Area, {
                id: "product_page_middle_right",
                className: "uk-width-1-2@m product-page-middle-right"
            })
        ),
        React.createElement(Tab, null),
        React.createElement(Area, {
            id: "product_page_bottom",
            className: "product-page-top"
        })
    );
}