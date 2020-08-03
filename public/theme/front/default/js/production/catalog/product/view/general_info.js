import Area from "../../../../../../../../js/production/area.js";

function Name({ name }) {
    return React.createElement(
        "h1",
        { className: "product-single-name" },
        name
    );
}

function Sku({ sku }) {
    return React.createElement(
        "div",
        { className: "product-single-sku mb-1" },
        React.createElement(
            "span",
            null,
            "SKU"
        ),
        React.createElement(
            "span",
            null,
            ": "
        ),
        sku
    );
}

export default function GeneralInfo({ name, short_description, sku, stock_availability }) {
    return React.createElement(Area, { id: "product_view_general_info", coreWidgets: [{
            'component': Name,
            'props': {
                name: name
            },
            'sort_order': 10,
            'id': 'product_single_name'
        }, {
            'component': Sku,
            'props': {
                sku: sku
            },
            'sort_order': 20,
            'id': 'product_single_sku'
        }, {
            'component': () => React.createElement(
                "div",
                { className: "stock-availability" },
                React.createElement(
                    "span",
                    null,
                    "Availability:"
                ),
                stock_availability === 1 ? React.createElement(
                    "span",
                    { className: "text-success" },
                    "In stock"
                ) : React.createElement(
                    "span",
                    { className: "text-danger" },
                    "Out of stock"
                )
            ),
            'props': {},
            'sort_order': 30,
            'id': 'product_stock_availability'
        }, {
            'component': () => React.createElement(
                "div",
                { className: "product-short-description mt-4" },
                short_description
            ),
            'props': {},
            'sort_order': 40,
            'id': 'product_short_description'
        }] });
}