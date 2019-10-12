import Area from "../../../../../../../../js/production/area.js";

function IdColumn({ areaProps }) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("product_id");
    }, []);

    return React.createElement(
        "td",
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
                        onKeyPress: e => {
                            if (e.key === 'Enter') areaProps.addFilter("id", "BETWEEN", `${e.target.value} AND ${filterTo.current.value}`);
                        },
                        placeholder: "From"
                    })
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement("input", {
                        type: "text",
                        ref: filterTo,
                        onKeyPress: e => {
                            if (e.key === 'Enter') areaProps.addFilter("id", "BETWEEN", `${filterFrom.current.value} AND ${e.target.value}`);
                        },
                        placeholder: "To"
                    })
                )
            )
        ),
        areaProps.rows.map((r, i) => {
            return React.createElement(
                "div",
                { className: "row", key: i },
                React.createElement(
                    "span",
                    null,
                    r.product_id
                )
            );
        })
    );
}

function PriceColumn({ areaProps }) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("price");
    }, []);

    return React.createElement(
        "td",
        { className: "row" },
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
                        onKeyPress: e => {
                            if (e.key === 'Enter') areaProps.addFilter("price", "BETWEEN", `${e.target.value} AND ${filterTo.current.value}`);
                        },
                        placeholder: "From"
                    })
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement("input", {
                        type: "text",
                        ref: filterTo,
                        onKeyPress: e => {
                            if (e.key === 'Enter') areaProps.addFilter("price", "BETWEEN", `${filterFrom.current.value} AND ${e.target.value}`);
                        },
                        placeholder: "To"
                    })
                )
            )
        ),
        areaProps.rows.map((r, i) => {
            const _price = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(_.get(r, 'price', ''));
            return React.createElement(
                "div",
                { className: "row", key: i },
                React.createElement(
                    "span",
                    null,
                    _price
                )
            );
        })
    );
}

function NameColumn({ areaProps }) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('name');
    }, []);

    return React.createElement(
        "td",
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
                    onKeyPress: e => {
                        if (e.key === 'Enter') areaProps.addFilter("name", "LIKE", `%${e.target.value}%`);
                    },
                    placeholder: "Product name"
                })
            )
        ),
        areaProps.rows.map((r, i) => {
            return React.createElement(
                "div",
                { className: "row", key: i },
                React.createElement(
                    "span",
                    null,
                    _.get(r, 'name', '')
                )
            );
        })
    );
}

function QtyColumn({ areaProps }) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('qty');
    }, []);

    return React.createElement(
        "td",
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
                        onKeyPress: e => {
                            if (e.key === 'Enter') areaProps.addFilter("qty", "BETWEEN", `${e.target.value} AND ${filterTo.current.value}`);
                        },
                        placeholder: "From"
                    })
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement("input", {
                        type: "text",
                        ref: filterTo,
                        onKeyPress: e => {
                            if (e.key === 'Enter') areaProps.addFilter("qty", "BETWEEN", `${filterFrom.current.value} AND ${e.target.value}`);
                        },
                        placeholder: "To"
                    })
                )
            )
        ),
        areaProps.rows.map((r, i) => {
            return React.createElement(
                "div",
                { className: "row", key: i },
                React.createElement(
                    "span",
                    null,
                    _.get(r, 'qty', '')
                )
            );
        })
    );
}

function GeneralColumn({ index, title, areaProps }) {
    React.useEffect(() => {
        areaProps.addField(index);
    }, []);
    return React.createElement(
        "td",
        { className: "column" },
        React.createElement(
            "div",
            { className: "header" },
            React.createElement(
                "div",
                { className: "title" },
                React.createElement(
                    "span",
                    null,
                    title
                )
            )
        ),
        areaProps.rows.map((r, i) => {
            return React.createElement(
                "div",
                { className: "row", key: i },
                React.createElement(
                    "span",
                    null,
                    _.get(r, index, '')
                )
            );
        })
    );
}

function ThumbColumn({ areaProps }) {
    React.useEffect(() => {
        areaProps.addField("image { thumb }");
    }, []);
    return React.createElement(
        "td",
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
        ),
        areaProps.rows.map((r, i) => {
            if (_.get(r, "image.thumb")) return React.createElement(
                "div",
                { key: i, className: "row" },
                React.createElement("img", { className: 'product-thumbnail', src: r.image.thumb })
            );else return React.createElement(
                "div",
                { key: i, className: "row" },
                React.createElement("span", { "uk-icon": "icon: image; ratio: 5" })
            );
        })
    );
}

function StatusColumn({ areaProps }) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("status");
    }, []);

    return React.createElement(
        "td",
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
                React.createElement("input", { type: "text", ref: filterInput, onKeyPress: e => {
                        if (e.key === 'Enter') areaProps.addFilter("status", "Equal", e.target.value);
                    } })
            )
        ),
        areaProps.rows.map((r, i) => {
            if (parseInt(_.get(r, "status")) === 1) return React.createElement(
                "div",
                { key: i, className: "row" },
                React.createElement(
                    "span",
                    { className: "uk-label uk-label-success" },
                    "Enable"
                )
            );else return React.createElement(
                "div",
                { key: i, className: "row" },
                React.createElement(
                    "span",
                    { className: "uk-label uk-label-danger" },
                    "Disabled"
                )
            );
        })
    );
}

export default function ProductGrid({ apiUrl, defaultFilter }) {
    const [products, setProducts] = React.useState([]);
    const [filters, setFilters] = React.useState(() => {
        if (defaultFilter !== undefined) return defaultFilter;else return [];
    });
    const [fields, setFields] = React.useState([]);

    const addFilter = (key, operator, value) => {
        let flag = 0;
        filters.forEach((f, i) => {
            if (f.key === key && !value) flag = 1; // Remove
            if (f.key === key && value) flag = 2; // Update
        });
        if (flag === 0) setFilters(prevFilters => prevFilters.concat({ key: key, operator: operator, value: value }));else if (flag === 1) {
            const setFilters = prevFilters.filter((f, index) => f.key !== key);
            setFilters(newFilters);
        } else setFilters(prevFilters => prevFilters.map((f, i) => {
            if (f.key === key) {
                f.operator = operator;
                f.value = value;
            }
            return f;
        }));
    };

    const cleanFilter = () => {
        setFilters([]);
    };
    const addField = field => {
        setFields(prevFields => prevFields.concat(field));
    };

    const applyFilter = () => {
        let formData = new FormData();
        formData.append('query', buildQuery());
        axios({
            method: 'post',
            url: apiUrl,
            headers: { 'content-type': 'multipart/form-data' },
            data: formData
        }).then(function (response) {
            if (response.headers['content-type'] !== "application/json") throw new Error('Something wrong, please try again');
            if (_.get(response, 'data.payload.data.productCollection.products')) {
                setProducts(_.get(response, 'data.payload.data.productCollection.products'));
            }
        }).catch(function (error) {}).finally(function () {
            // e.target.value = null;
            // setUploading(false);
        });
    };

    const buildQuery = () => {
        let filterStr = "";
        filters.forEach((f, i) => {
            filterStr += `${f.key} : {operator : ${f.operator} value: "${f.value}"} `;
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
    }, [fields, filters]);

    React.useLayoutEffect(() => {
        // Fix height of row
        let maxHeightHeader = -1;
        jQuery('.column .header').each(function (e) {
            maxHeightHeader = maxHeightHeader > jQuery(this).height() ? maxHeightHeader : jQuery(this).height();
        });

        jQuery('.column .header').each(function () {
            jQuery(this).height(maxHeightHeader);
        });

        let maxHeightRow = -1;
        jQuery('.column .row').each(function (e) {
            maxHeightRow = maxHeightRow > jQuery(this).height() ? maxHeightRow : jQuery(this).height();
        });

        jQuery('.column .row').each(function () {
            jQuery(this).height(maxHeightRow);
        });
    });

    return React.createElement(
        "div",
        { className: "" },
        React.createElement(
            "table",
            { className: "" },
            React.createElement(
                "tbody",
                null,
                React.createElement(Area, {
                    className: "",
                    id: "product-grid",
                    rows: products,
                    addFilter: addFilter,
                    cleanFilter: cleanFilter,
                    addField: addField,
                    applyFilter: applyFilter,
                    reactcomponent: "tr",
                    coreWidgets: [{
                        component: IdColumn,
                        props: {},
                        sort_order: 10,
                        id: "id"
                    }, {
                        component: ThumbColumn,
                        props: {},
                        sort_order: 20,
                        id: "thumb"
                    }, {
                        component: NameColumn,
                        props: {},
                        sort_order: 30,
                        id: "name"
                    }, {
                        component: StatusColumn,
                        props: {},
                        sort_order: 40,
                        id: "status"
                    }, {
                        component: QtyColumn,
                        props: {},
                        sort_order: 50,
                        id: "qty"
                    }, {
                        component: PriceColumn,
                        props: {},
                        sort_order: 60,
                        id: "price"
                    }]
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