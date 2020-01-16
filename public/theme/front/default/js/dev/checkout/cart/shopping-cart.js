import Area from "../../../../../../../js/production/area.js";

function Title() {
    return <div className="uk-width-1-1">
        <h1 className="uk-text-center">Shopping cart</h1>
    </div>
}

function ShoppingCart() {
    return <Area
        id="shopping-cart-page"
        className="uk-grid uk-grid-small"
        coreWidgets={[
            {
                component: Title,
                props : {},
                sort_order: 10,
                id: "shopping-cart-title"
            }
        ]}
    />
}

export default ShoppingCart