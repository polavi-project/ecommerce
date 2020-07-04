import Area from "../../../../../../../../js/production/area.js";
import {Name} from "./item/name.js";
import {Thumbnail} from "./item/thumbnail.js";
import {Price} from "./item/price.js";

export default function ProductList({products = []}) {
    if(products.length === 0)
        return <div className="product-list"><div className="uk-text-center">There is no product to display</div></div>;
    return <div className="uk-container">
        <div className="product-list uk-grid-small uk-grid uk-flex-center uk-child-width-1-4@m uk-child-width-1-2@s">
            {
                products.map((p, index) => {
                    return <Area
                        id={"product_item"}
                        className="listing-tem"
                        product={p}
                        key={index}
                        coreWidgets={[
                            {
                                component: Thumbnail,
                                props : {imageUrl: _.get(p, 'image.list'), alt: p.name},
                                sort_order: 10,
                                id: "thumbnail"
                            },
                            {
                                component: Name,
                                props : {name: p.name, url: p.url},
                                sort_order: 20,
                                id: "name"
                            },
                            {
                                component: Price,
                                props : {price: p.price, salePrice: p.salePrice},
                                sort_order: 30,
                                id: "price"
                            }
                        ]}
                    />
                })
            }
        </div>
    </div>
}