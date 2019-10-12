import Area from "../../../../../../../../js/production/area.js";
import { Name } from "../../../../production/catalog/product/list/item/name.js";
import { Thumbnail } from "../../../../production/catalog/product/list/item/thumbnail.js";
import { Price } from "../../../../production/catalog/product/list/item/price.js";
import { AddToCart } from "../../../../production/catalog/product/list/item/buy_button.js";

export default function ProductList({ products, addItemApi }) {
    return React.createElement(
        "div",
        { className: "product-list", "uk-grid": "true" },
        products.map((p, index) => {
            return React.createElement(Area, {
                id: "product-item-" + p.product_id,
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
                    props: { price: p.price },
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