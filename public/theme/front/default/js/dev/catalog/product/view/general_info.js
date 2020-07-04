import Area from "../../../../../../../../js/production/area.js";

function Name({name}) {
    return <h1 className="product-single-name">{name}</h1>
}

function Sku({sku}) {
    return <div className="product-single-sku"><span>SKU</span><span>: </span>{sku}</div>
}

export default function GeneralInfo({name, price, description, sku, stock_availability}) {
    return <Area id="product_view_general_info" coreWidgets={[
        {
            'component': Name,
            'props': {
                name: name
            },
            'sort_order': 10,
            'id': 'product-single-name'
        },
        {
            'component': Sku,
            'props': {
                sku: sku
            },
            'sort_order': 20,
            'id': 'product-single-sku'
        }
    ]}/>
}