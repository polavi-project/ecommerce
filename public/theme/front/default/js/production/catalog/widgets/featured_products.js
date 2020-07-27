import ProductList from "../product/list/list.js";

export default function FeaturedProducts({ title, products, countPerRow, addItemApi }) {
    return React.createElement(
        "div",
        { className: "" },
        React.createElement(
            "div",
            { className: "h2" },
            title
        ),
        React.createElement(
            "div",
            { className: "mt-4" },
            React.createElement(ProductList, { products: products, addItemApi: addItemApi, countPerRow: countPerRow ? countPerRow : 4 })
        )
    );
}