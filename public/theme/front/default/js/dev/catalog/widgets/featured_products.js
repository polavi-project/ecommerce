import ProductList from "../product/list/list.js";

export default function FeaturedProducts({title, products, addItemApi}) {
    return <div className="">
        <p className="uk-h1 uk-text-center">{title}</p>
        <div className="">
            <ProductList products={products} addItemApi={addItemApi}/>
        </div>
    </div>
}