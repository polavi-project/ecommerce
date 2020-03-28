import { Fetch } from "../../../../../../../js/production/fetch.js";

export default function AddToCart({ addItemApi, areaProps }) {
    const onAddToCart = e => {
        e.preventDefault();
        Fetch(addItemApi, false, "POST", { product_id: areaProps.product.product_id, qty: 1 });
    };

    return React.createElement(
        "div",
        { className: "add-to-cart" },
        React.createElement(
            "a",
            { className: "uk-button uk-button-primary uk-button-small",
                onClick: e => onAddToCart(e) },
            React.createElement(
                "span",
                null,
                "Add to cart"
            )
        )
    );
}