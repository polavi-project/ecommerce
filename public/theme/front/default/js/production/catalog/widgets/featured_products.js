import ProductList from "../product/list/list.js";

export default function FeaturedProducts({ title, products, addItemApi }) {
    return React.createElement(
        "div",
        { className: "" },
        React.createElement(
            "p",
            { className: "uk-h1 uk-text-center" },
            title
        ),
        React.createElement(
            "div",
            { className: "" },
            React.createElement(ProductList, { products: products, addItemApi: addItemApi })
        )
    );
}