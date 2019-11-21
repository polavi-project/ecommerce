import Area from "../../../../../../../../js/production/area.js";
import { Name } from "./item/name.js";
import { Thumbnail } from "./item/thumbnail.js";
import { Price } from "./item/price.js";
import { AddToCart } from "./item/buy_button.js";

export default function ProductList({ products = [], addItemApi }) {
    if (products.length === 0) return React.createElement(
        "div",
        { className: "product-list uk-grid" },
        React.createElement(
            "p",
            null,
            "There is no product to display"
        )
    );
    return React.createElement(
        "div",
        { className: "product-list uk-grid" },
        products.map((p, index) => {
            return React.createElement(Area, {
                id: "product_item_" + p.product_id,
                product: p,
                key: index,
                coreWidgets: [{
                    component: Thumbnail,
                    props: { imageUrl: _.get(p, 'image.list'), alt: p.name },
                    sort_order: 10,
                    id: "thumbnail"
                }, {
                    component: Name,
                    props: { name: p.name, url: p.url },
                    sort_order: 20,
                    id: "name"
                }, {
                    component: Price,
                    props: { price: p.price, salePrice: p.salePrice },
                    sort_order: 30,
                    id: "price"
                }, {
                    component: AddToCart,
                    props: { id: p.product_id, addItemApi },
                    sort_order: 40,
                    id: "add_to_cart"
                }]
            });
        })
    );
}