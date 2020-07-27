import Area from "../../../../../../../../js/production/area.js";
import {Name} from "./item/name.js";
import {Thumbnail} from "./item/thumbnail.js";
import {Price} from "./item/price.js";

export default function ProductList({products = [], countPerRow = 4}) {
    if(products.length === 0)
        return <div className="product-list"><div>There is no product to display</div></div>;
    return <div className={"product-list row " + "row-cols-" + countPerRow}>
        {
            products.map((p, index) => {
                return <React.Fragment>
                    <Area
                        id={"product_item"}
                        className="listing-tem col"
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
                </React.Fragment>
            })
        }
    </div>
}