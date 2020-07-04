import ProductGrid from "../../../../production/catalog/product/grid/grid.js";

export default function ProductList({apiUrl, areaProps}) {
    return <div id="category_edit_product_list" className="sml-block">
        <div className="sml-block-title"></div>
        <ProductGrid apiUrl={apiUrl} areaProps={areaProps}/>
    </div>
}