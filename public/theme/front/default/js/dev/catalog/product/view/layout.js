import Area from "../../../../../../../../js/production/area.js";

export default function ProductPageLayout() {
    return <div className="uk-grid-small uk-grid">
        <Area
            id="product_page_top"
            className="product-page-top"
        />
        <div className="product-page-middle uk-grid uk-grid-small">
            <Area
                id="product_page_middle_left"
                className="uk-width-1-2@m product-page-middle-left"
            />
            <Area
                id="product_page_middle_right"
                className="uk-width-1-2@m product-page-middle-right"
            />
        </div>
        <Area
            id="product_page_bottom"
            className="product-page-top"
        />
    </div>
}