import Area from "../../../../../../../../js/production/area.js";

function Name({ name }) {
    return React.createElement(
        "h1",
        { className: "product-single-name" },
        name
    );
}

function Description({ description }) {
    return React.createElement(
        "div",
        { className: "product-single-des" },
        description
    );
}

function Sku({ sku }) {
    return React.createElement(
        "div",
        { className: "product-single-sku" },
        sku
    );
}

export default function GeneralInfo({ name, price, description, sku, stock_availability }) {
    return React.createElement(Area, { className: "uk-width-1-2", id: "product-single-general-info", coreWidgets: [{
            'component': Name,
            'props': {
                name: name
            },
            'sort_order': 10,
            'id': 'product-single-name'
        }, {
            'component': Description,
            'props': {
                description: description
            },
            'sort_order': 20,
            'id': 'product-single-description'
        }, {
            'component': Sku,
            'props': {
                sku: sku
            },
            'sort_order': 30,
            'id': 'product-single-sku'
        }] });
}