import Area from "../../../../../../../../js/production/area.js";

function Tab() {
    return <Area
        id={"product_detail_tab"}
        wrapper={"ul"}
        className={"uk-accordion"}
        wrapperProps={
            {
                "uk-accordion" : "true"
            }
        }

    />
}

export default function ProductPageLayout() {
    return <div className="uk-grid-small uk-grid">
        <Area
            id="product_page_top"
            className="product-page-top"
        />
        <div className="product-page-middle uk-grid uk-grid-small uk-width-1-1">
            <Area
                id="product_page_middle_left"
                className="uk-width-1-2@m product-page-middle-left"
            />
            <Area
                id="product_page_middle_right"
                className="uk-width-1-2@m product-page-middle-right"
            />
        </div>
        <Tab/>
        <Area
            id="product_page_bottom"
            className="product-page-top"
        />
    </div>
}