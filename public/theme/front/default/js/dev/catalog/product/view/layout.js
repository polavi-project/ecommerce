import Area from "../../../../../../../../js/production/area.js";

export default function ProductPageLayout() {
    return <div className="uk-width-1-1 uk-grid-small uk-grid">
        <Area
            id="product_page_top"
            className="uk-width-1-1 product-page-top"
        />
        <div className="uk-width-1-1 product-page-middle uk-grid uk-grid-small">
            <Area
                id="product_page_middle_left"
                className="uk-width-1-2 product-page-middle-left"
            />
            <Area
                id="product_page_middle_right"
                className="uk-width-1-2 product-page-middle-right"
            />
        </div>
        <Area
            id="product_page_bottom"
            className="uk-width-1-1 product-page-top"
        />
    </div>
}