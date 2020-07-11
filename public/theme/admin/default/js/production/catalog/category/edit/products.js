import ProductGrid from "../../../../production/catalog/product/grid/grid.js";

export default function ProductList({ apiUrl, areaProps, limit }) {
    return React.createElement(
        "div",
        { id: "category_edit_product_list", className: "sml-block" },
        React.createElement("div", { className: "sml-block-title" }),
        React.createElement(ProductGrid, { apiUrl: apiUrl, limit: limit, areaProps: areaProps })
    );
}