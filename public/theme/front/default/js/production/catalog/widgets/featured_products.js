import ProductList from "../product/list/list.js";

export default function FeaturedProducts({ title, products, addItemApi }) {
    return React.createElement(
        "div",
        { className: "uk-width-1-1" },
        React.createElement(
            "p",
            { className: "uk-h1 uk-text-center" },
            title
        ),
        React.createElement(
            "div",
            { className: "uk-flex uk-flex-center" },
            React.createElement(ProductList, { products: products, addItemApi: addItemApi })
        )
    );
}