import Area from "../../../../../../../../js/production/area.js";
import { ReducerRegistry } from "../../../../../../../../js/production/reducer_registry.js";
import { PRODUCT_COLLECTION_FILTER_CHANGED } from "../../../../../../../../js/production/action.js";

function Price({ minPrice, MaxPrice, areaProps }) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    return React.createElement(
        "div",
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
                React.createElement("input", {
                    type: "text",
                    ref: filterFrom,
                    onKeyPress: e => {
                        if (e.key === 'Enter') areaProps.addFilter("price", "BETWEEN", `${e.target.value} AND ${filterTo.current.value}`);
                    },
                    placeholder: "From"
                }),
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
    );
}

function Attributes({ attributes, areaProps }) {
    const onChange = (e, attributeCode, optionId) => {
        let filter = undefined;
        areaProps.filters.forEach((f, i) => {
            if (f.key === attributeCode) filter = f;
        });
        if (filter === undefined) {
            if (e.target.checked === false) {
                return;
            } else {
                areaProps.addFilter(attributeCode, "IN", [optionId]);
            }
        } else {
            if (e.target.checked === false) {
                areaProps.addFilter(attributeCode, "IN", filter.value.filter(v => {
                    return v !== optionId;
                }));
            } else {
                areaProps.addFilter(attributeCode, "IN", filter.value.concat(optionId));
            }
        }
    };
    return React.createElement(
        "div",
        { className: "filter-attributes" },
        attributes.map((a, i) => {
            return React.createElement(
                "div",
                { key: i },
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "strong",
                        null,
                        a.attribute_name
                    )
                ),
                React.createElement(
                    "ul",
                    { className: "uk-list" },
                    a.options.map((o, j) => {
                        return React.createElement(
                            "li",
                            { key: j },
                            React.createElement(
                                "label",
                                null,
                                React.createElement("input", { type: "checkbox", onChange: e => onChange(e, a.attribute_code, o.option_id) }),
                                " ",
                                o.option_text
                            )
                        );
                    })
                )
            );
        })
    );
}

function reducer(productCollectionFilter = [], action = {}) {
    if (action.type === PRODUCT_COLLECTION_FILTER_CHANGED) {
        if (action.payload.productCollectionFilter !== undefined) return action.payload.productCollectionFilter;
    }
    return productCollectionFilter;
}

ReducerRegistry.register('productCollectionFilter', reducer);

export default function Filter({ apiUrl }) {
    const dispatch = ReactRedux.useDispatch();
    const [data, setData] = React.useState(() => {
        let formData = new FormData();
        formData.append('query', "{productFilterTool(filter : {category : {operator: IN value: \"1\"} } ) {price {minPrice maxPrice } attributes {attribute_name attribute_code options {option_id option_text} } }}");
        axios({
            method: 'post',
            url: apiUrl,
            headers: { 'content-type': 'multipart/form-data' },
            data: formData
        }).then(function (response) {
            if (response.headers['content-type'] !== "application/json") throw new Error('Something wrong, please try again');
            if (_.get(response, 'data.payload.data.productFilterTool')) {
                setData(_.get(response, 'data.payload.data.productFilterTool'));
            }
        }).catch(function (error) {}).finally(function () {
            // e.target.value = null;
            // setUploading(false);
        });
    });
    const [filters, setFilters] = React.useState([]);

    const addFilter = (key, operator, value) => {
        let flag = 0;
        filters.forEach((f, i) => {
            if (f.key === key && (!value || _.isEmpty(value))) flag = 1; // Remove
            if (f.key === key && value && !_.isEmpty(value)) flag = 2; // Update
        });
        if (flag === 0) setFilters(prevFilters => prevFilters.concat({ key: key, operator: operator, value: value }));else if (flag === 1) {
            const newFilters = filters.filter((f, index) => f.key !== key);
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

    const removeFilter = key => {
        setFilters(filters.filter((v, k) => v.key !== key));
    };

    React.useEffect(() => {
        dispatch({ 'type': PRODUCT_COLLECTION_FILTER_CHANGED, 'payload': { 'productCollectionFilter': filters } });
    }, [filters]);

    return React.createElement(Area, {
        id: "category-info",
        addFilter: addFilter,
        filters: filters,
        coreWidgets: [{
            component: Price,
            props: { minPrice: _.get(data, 'price.minPrice', null), maxPrice: _.get(data, 'price.maxPrice', null) },
            sort_order: 10,
            id: "filter-price"
        }, {
            component: Attributes,
            props: { attributes: _.get(data, 'attributes', []) },
            sort_order: 20,
            id: "filter-attributes"
        }]
    });
}