import ProductList from "../product/list/list.js";

export default function FeaturedProducts({title, products, countPerRow, addItemApi}) {
    return <div className="">
        <div className="h2">{title}</div>
        <div className="mt-4">
            <ProductList products={products} addItemApi={addItemApi} countPerRow={countPerRow ? countPerRow : 4}/>
        </div>
    </div>
}