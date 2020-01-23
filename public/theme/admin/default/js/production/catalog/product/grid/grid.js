var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Area from "../../../../../../../../js/production/area.js";
import { Fetch } from "../../../../../../../../js/production/fetch.js";

function IdColumnHeader({ filters, removeFilter, updateFilter, areaProps }) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    const onKeyPress = e => {
        if (e.key === 'Enter') {
            if (filterTo.current.value == "" && filterFrom.current.value == "") removeFilter("id");else updateFilter("id", "BETWEEN", `${filterFrom.current.value} AND ${filterTo.current.value}`);
        }
    };

    React.useEffect(() => {
        areaProps.addField("product_id");
    }, []);

    React.useEffect(() => {
        filterFrom.current.value = filters.findIndex(e => e.key === 'id') === -1 ? "" : filterFrom.current.value;
        filterTo.current.value = filters.findIndex(e => e.key === 'id') === -1 ? "" : filterTo.current.value;
    });

    return React.createElement(
        "th",
        { className: "column" },
        React.createElement(
            "div",
            { className: "header id-header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    "ID"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement(
                    "div",
                    null,
                    React.createElement("input", {
                        type: "text",
                        ref: filterFrom,
                        onKeyPress: e => onKeyPress(e),
                        placeholder: "From",
                        className: "uk-input uk-form-small uk-form-width-small"
                    })
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement("input", {
                        type: "text",
                        ref: filterTo,
                        onKeyPress: e => onKeyPress(e),
                        placeholder: "To",
                        className: "uk-input uk-form-small uk-form-width-small"
                    })
                )
            )
        )
    );
}

function IdColumnRow({ row }) {
    return React.createElement(
        "td",
        null,
        row.product_id
    );
}

function SkuColumnHeader({ filters, removeFilter, updateFilter, areaProps }) {
    const filterInput = React.useRef(null);

    const onKeyPress = e => {
        if (e.key === 'Enter') {
            if (e.target.value == "") removeFilter("sku");else updateFilter("sku", "LIKE", `%${e.target.value}%`);
        }
    };

    React.useEffect(() => {
        areaProps.addField("sku");
    }, []);

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex(e => e.key === 'sku') === -1 ? "" : filterInput.current.value;
    });

    return React.createElement(
        "th",
        { className: "column" },
        React.createElement(
            "div",
            { className: "header id-header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    "SKU"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement("input", {
                    type: "text",
                    ref: filterInput,
                    onKeyPress: e => onKeyPress(e),
                    placeholder: "Sku",
                    className: "uk-input uk-form-small uk-form-width-small"
                })
            )
        )
    );
}

function SkuColumnRow({ row }) {
    return React.createElement(
        "td",
        null,
        row.sku
    );
}

function PriceColumnHeader({ removeFilter, filters, updateFilter, areaProps }) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    const onKeyPress = e => {
        if (e.key === 'Enter') {
            if (filterTo.current.value == "" && filterFrom.current.value == "") removeFilter("price");else updateFilter("price", "BETWEEN", `${filterFrom.current.value} AND ${filterTo.current.value}`);
        }
    };

    React.useEffect(() => {
        areaProps.addField("price");
    }, []);

    React.useEffect(() => {
        filterFrom.current.value = filters.findIndex(e => e.key === 'price') === -1 ? "" : filterFrom.current.value;
        filterTo.current.value = filters.findIndex(e => e.key === 'price') === -1 ? "" : filterTo.current.value;
    });

    return React.createElement(
        "th",
        null,
        React.createElement(
            "div",
            { className: "header price-header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    "Price"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement(
                    "div",
                    null,
                    React.createElement("input", {
                        type: "text",
                        ref: filterFrom,
                        onKeyPress: e => onKeyPress(e),
                        placeholder: "From",
                        className: "uk-input uk-form-small uk-form-width-small"
                    })
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement("input", {
                        type: "text",
                        ref: filterTo,
                        onKeyPress: e => onKeyPress(e),
                        placeholder: "To",
                        className: "uk-input uk-form-small uk-form-width-small"
                    })
                )
            )
        )
    );
}

function PriceColumnRow({ row }) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const price = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(row.price);
    return React.createElement(
        "td",
        null,
        price
    );
}

function NameColumnHeader({ filters, removeFilter, updateFilter, areaProps }) {
    const filterInput = React.useRef(null);

    const onKeyPress = e => {
        if (e.key === 'Enter') {
            if (e.target.value == "") removeFilter("name");else updateFilter("name", "LIKE", `%${e.target.value}%`);
        }
    };

    React.useEffect(() => {
        areaProps.addField('name');
    }, []);

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex(e => e.key === 'name') === -1 ? "" : filterInput.current.value;
    });

    return React.createElement(
        "th",
        { className: "column" },
        React.createElement(
            "div",
            { className: "header name-header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    "Product name"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement("input", {
                    type: "text",
                    ref: filterInput,
                    onKeyPress: e => onKeyPress(e),
                    placeholder: "Product name",
                    className: "uk-input uk-form-small uk-form-width-medium"
                })
            )
        )
    );
}

function NameColumnRow({ row }) {
    return React.createElement(
        "td",
        null,
        row.name
    );
}

function QtyColumnHeader({ areaProps, filters, removeFilter, updateFilter }) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    const onKeyPress = e => {
        if (e.key === 'Enter') {
            if (filterTo.current.value == "" && filterFrom.current.value == "") removeFilter("qty");else updateFilter("qty", "BETWEEN", `${filterFrom.current.value} AND ${filterTo.current.value}`);
        }
    };

    React.useEffect(() => {
        areaProps.addField('qty');
    }, []);

    React.useEffect(() => {
        filterFrom.current.value = filters.findIndex(e => e.key === 'qty') === -1 ? "" : filterFrom.current.value;
        filterTo.current.value = filters.findIndex(e => e.key === 'qty') === -1 ? "" : filterTo.current.value;
    });

    return React.createElement(
        "th",
        { className: "column" },
        React.createElement(
            "div",
            { className: "header name-header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    "Qty"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement(
                    "div",
                    null,
                    React.createElement("input", {
                        type: "text",
                        ref: filterFrom,
                        onKeyPress: e => onKeyPress(e),
                        placeholder: "From",
                        className: "uk-input uk-form-small uk-form-width-small"
                    })
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement("input", {
                        type: "text",
                        ref: filterTo,
                        onKeyPress: e => onKeyPress(e),
                        placeholder: "To",
                        className: "uk-input uk-form-small uk-form-width-small"
                    })
                )
            )
        )
    );
}

function QtyColumnRow({ row }) {
    return React.createElement(
        "td",
        null,
        row.qty
    );
}

function ThumbColumnHeader({ areaProps }) {
    React.useEffect(() => {
        areaProps.addField("image { thumb }");
    }, []);
    return React.createElement(
        "th",
        { className: "column" },
        React.createElement(
            "div",
            { className: "header thumb-header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    "Thumbnail"
                )
            )
        )
    );
}

function ThumbColumnRow({ row }) {
    if (_.get(row, "image.thumb")) return React.createElement(
        "td",
        null,
        React.createElement("img", { className: 'product-thumbnail table-row-img', src: row.image.thumb })
    );else return React.createElement(
        "td",
        null,
        React.createElement("span", { "uk-icon": "icon: image; ratio: 3" })
    );
}

function StatusColumnHeader({ areaProps, filters, updateFilter }) {
    const filterInput = React.useRef(null);

    const onChange = e => {
        updateFilter("status", "=", `${e.target.value}`);
    };

    React.useEffect(() => {
        areaProps.addField("status");
    }, []);

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex(e => e.key === 'status') === -1 ? null : filterInput.current.value;
    });

    return React.createElement(
        "th",
        { className: "column" },
        React.createElement(
            "div",
            { className: "header status-header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    "Status"
                )
            ),
            React.createElement(
                "div",
                { className: "filter" },
                React.createElement(
                    "select",
                    {
                        ref: filterInput,
                        onChange: e => onChange(e),
                        className: "uk-select uk-form-small uk-form-width-small"
                    },
                    React.createElement(
                        "option",
                        { value: 1 },
                        "Enabled"
                    ),
                    React.createElement(
                        "option",
                        { value: 0 },
                        "Disabled"
                    )
                )
            )
        )
    );
}

function StatusColumnRow({ row }) {
    if (parseInt(_.get(row, "status")) === 1) return React.createElement(
        "td",
        null,
        React.createElement(
            "span",
            { className: "uk-label uk-label-success" },
            "Enable"
        )
    );else return React.createElement(
        "td",
        null,
        React.createElement(
            "span",
            { className: "uk-label uk-label-danger" },
            "Disabled"
        )
    );
}

export default function ProductGrid({ apiUrl, areaProps }) {
    const [products, setProducts] = React.useState([]);
    const [fields, setFields] = React.useState([]);

    const addField = field => {
        setFields(prevFields => prevFields.concat(field));
    };

    const applyFilter = () => {
        let formData = new FormData();
        formData.append('query', buildQuery());

        Fetch(apiUrl, false, 'POST', formData, null, response => {
            if (_.get(response, 'payload.data.productCollection.products')) {
                setProducts(_.get(response, 'payload.data.productCollection.products'));
            }
        });
    };

    const buildQuery = () => {
        let filterStr = "";
        areaProps.filters.forEach((f, i) => {
            filterStr += `${f.key} : {operator : "${f.operator}" value: "${f.value}"} `;
        });
        filterStr = filterStr.trim();
        if (filterStr) filterStr = `(filter : {${filterStr}})`;

        let fieldStr = "";
        fields.forEach((f, i) => {
            fieldStr += `${f} `;
        });

        return `{productCollection ${filterStr} {products {${fieldStr}} total currentFilter}}`;
    };

    React.useEffect(() => {
        if (fields.length === 0) return;
        applyFilter();
    }, [fields, areaProps.filters]);

    return React.createElement(
        "div",
        { className: "uk-overflow-auto" },
        React.createElement(
            "table",
            { className: "uk-table uk-table-small uk-table-divider" },
            React.createElement(
                "thead",
                null,
                React.createElement(Area, {
                    className: "",
                    id: "product_grid_header",
                    filters: areaProps.filters,
                    addFilter: areaProps.addFilter,
                    updateFilter: areaProps.updateFilter,
                    removeFilter: areaProps.removeFilter,
                    cleanFilter: areaProps.cleanFilter,
                    addField: addField,
                    applyFilter: applyFilter,
                    reactcomponent: "tr",
                    coreWidgets: [{
                        component: IdColumnHeader,
                        props: _extends({}, areaProps, { addField, applyFilter }),
                        sort_order: 10,
                        id: "id"
                    }, {
                        component: SkuColumnHeader,
                        props: _extends({}, areaProps, { addField, applyFilter }),
                        sort_order: 15,
                        id: "sku"
                    }, {
                        component: ThumbColumnHeader,
                        props: _extends({}, areaProps, { addField, applyFilter }),
                        sort_order: 20,
                        id: "thumb"
                    }, {
                        component: NameColumnHeader,
                        props: _extends({}, areaProps, { addField, applyFilter }),
                        sort_order: 30,
                        id: "name"
                    }, {
                        component: StatusColumnHeader,
                        props: _extends({}, areaProps, { addField, applyFilter }),
                        sort_order: 40,
                        id: "status"
                    }, {
                        component: QtyColumnHeader,
                        props: _extends({}, areaProps, { addField, applyFilter }),
                        sort_order: 50,
                        id: "qty"
                    }, {
                        component: PriceColumnHeader,
                        props: _extends({}, areaProps, { addField, applyFilter }),
                        sort_order: 60,
                        id: "price"
                    }]
                })
            ),
            React.createElement(
                "tbody",
                null,
                products.map((p, i) => {
                    return React.createElement(Area, {
                        key: i,
                        className: "",
                        id: "product_grid_row",
                        row: p,
                        reactcomponent: "tr",
                        coreWidgets: [{
                            component: IdColumnRow,
                            props: { row: p },
                            sort_order: 10,
                            id: "id"
                        }, {
                            component: SkuColumnRow,
                            props: { row: p },
                            sort_order: 15,
                            id: "sku"
                        }, {
                            component: ThumbColumnRow,
                            props: { row: p },
                            sort_order: 20,
                            id: "thumb"
                        }, {
                            component: NameColumnRow,
                            props: { row: p },
                            sort_order: 30,
                            id: "name"
                        }, {
                            component: StatusColumnRow,
                            props: { row: p },
                            sort_order: 40,
                            id: "status"
                        }, {
                            component: QtyColumnRow,
                            props: { row: p },
                            sort_order: 50,
                            id: "qty"
                        }, {
                            component: PriceColumnRow,
                            props: { row: p },
                            sort_order: 60,
                            id: "price"
                        }]
                    });
                })
            )
        ),
        products.length === 0 && React.createElement(
            "div",
            null,
            "There is no product to display"
        )
    );
}