import Area from "../../../../../../../js/production/area.js";

function Title() {
    return React.createElement(
        "div",
        { className: "mb-4 col-12" },
        React.createElement(
            "h1",
            { className: "shopping-cart-title" },
            "Shopping cart"
        )
    );
}

function ShoppingCart() {
    return React.createElement(Area, {
        id: "shopping-cart-page",
        className: "row",
        coreWidgets: [{
            component: Title,
            props: {},
            sort_order: 10,
            id: "shopping-cart-title"
        }]
    });
}

export default ShoppingCart;