import ProductGrid from "../../../../production/catalog/product/grid/grid.js";

export default function ProductList({ apiUrl, areaProps }) {
    return React.createElement(
        "div",
        { id: "category_edit_product_list" },
        React.createElement(
            "div",
            { className: "group-form-title" },
            React.createElement(
                "strong",
                null,
                "Products"
            )
        ),
        React.createElement(ProductGrid, { apiUrl: apiUrl, areaProps: areaProps })
    );
}