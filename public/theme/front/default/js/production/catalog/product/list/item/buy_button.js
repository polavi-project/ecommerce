import { Fetch } from "../../../../../../../../../js/production/fetch.js";

function AddToCart({ id, addItemApi }) {
    const onAddToCart = (e, id) => {
        e.preventDefault();
        Fetch(addItemApi, false, "POST", { product_id: id, qty: 1 });
    };

    return React.createElement(
        "div",
        { className: "add-to-cart" },
        React.createElement(
            "a",
            { className: "uk-button uk-button-primary uk-button-small",
                onClick: e => onAddToCart(e, id) },
            React.createElement(
                "span",
                null,
                "Add to cart"
            )
        )
    );
}

export { AddToCart };