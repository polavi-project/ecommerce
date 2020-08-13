import Area from "../../../../../../../../js/production/area.js";
import Tabs from "./tabs.js";

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
                    className: "col-12 col-md-5 product-page-middle-left"
                }),
                React.createElement(Area, {
                    id: "product_page_middle_right",
                    className: "col-12 col-md-7 product-page-middle-right"
                })
            )
        ),
        React.createElement(Tabs, { id: "product_single_tabs" }),
        React.createElement(Area, {
            id: "product_page_bottom",
            className: "product-page-top"
        })
    );
}