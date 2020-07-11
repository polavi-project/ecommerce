import ProductGrid from "../../../../production/catalog/product/grid/grid.js";

export default function ProductList({apiUrl, areaProps, limit}) {
    return <div id="category_edit_product_list" className="sml-block">
        <div className="sml-block-title"></div>
        <ProductGrid apiUrl={apiUrl} limit={limit} areaProps={areaProps}/>
    </div>
}