import ProductGrid from "../../../../production/catalog/product/grid/grid.js";

export default function ProductList({apiUrl, areaProps}) {
    return <div id="category_edit_product_list">
        <div className="group-form-title"><strong>Products</strong></div>
        <ProductGrid apiUrl={apiUrl} areaProps={areaProps}/>
    </div>
}