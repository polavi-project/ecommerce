import Area from "../../../../../../../../js/production/area.js";

export default function ProductPageLayout() {
    return React.createElement(
        "div",
        { className: "product-detail" },
        React.createElement(Area, {
            id: "product_page_top",
            className: "product-page-top"
        }),
        React.createElement(
            "div",
            { className: "product-page-middle" },
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(Area, {
                    id: "product_page_middle_left",
                    className: "col-5 product-page-middle-left"
                }),
                React.createElement(Area, {
                    id: "product_page_middle_right",
                    className: "col-7 product-page-middle-right"
                })
            )
        ),
        React.createElement(Area, {
            id: "product_page_bottom",
            className: "product-page-top"
        })
    );
}