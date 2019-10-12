import ProductGrid from "../../../../production/catalog/product/grid/grid.js";

export default function ProductList({ categoryId, apiUrl }) {
    return React.createElement(
        "div",
        { id: "category_edit_product_list", className: "group-form" },
        React.createElement(
            "div",
            { className: "group-form-title" },
            React.createElement(
                "span",
                null,
                "Products"
            )
        ),
        React.createElement(ProductGrid, { apiUrl: apiUrl, defaultFilter: [{ key: 'category', operator: 'IN', value: [categoryId] }] })
    );
}