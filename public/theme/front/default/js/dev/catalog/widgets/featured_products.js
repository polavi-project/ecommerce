import ProductList from "../product/list/list.js";

export default function FeaturedProducts({title, products, addItemApi}) {
    return <div className="uk-width-1-1">
        <p className="uk-h1 uk-text-center">{title}</p>
        <div className="uk-flex uk-flex-center">
            <ProductList products={products} addItemApi={addItemApi}/>
        </div>
    </div>
}