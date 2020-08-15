import Area from "../../../../../../../js/production/area.js";

function Title() {
    return <div className="mb-4 col-12">
        <h1 className="shopping-cart-title">Shopping cart</h1>
    </div>
}

function ShoppingCart() {
    return <Area
        id="shopping-cart-page"
        className="row"
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