import Area from "../../../../../../../js/production/area.js";

function Title() {
    return React.createElement(
        "div",
        { className: "uk-width-1-1" },
        React.createElement(
            "h1",
            { className: "uk-text-center" },
            "Shopping cart"
        )
    );
}

function ShoppingCart() {
    return React.createElement(Area, {
        id: "shopping-cart-page",
        className: "uk-grid uk-grid-small",
        coreWidgets: [{
            component: Title,
            props: {},
            sort_order: 10,
            id: "shopping-cart-title"
        }]
    });
}

export default ShoppingCart;