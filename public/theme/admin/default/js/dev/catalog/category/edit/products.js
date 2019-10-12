import ProductGrid from "../../../../production/catalog/product/grid/grid.js";

export default function ProductList({categoryId, apiUrl}) {
    return <div id="category_edit_product_list" className="group-form">
        <div className="group-form-title"><span>Products</span></div>
        <ProductGrid apiUrl={apiUrl} defaultFilter={[{key: 'category', operator: 'IN', value: [categoryId]}]}/>
    </div>
}