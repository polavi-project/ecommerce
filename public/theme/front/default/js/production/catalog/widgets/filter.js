import Area from "../../../../../../../js/production/area.js";
import { Fetch } from "../../../../../../../js/production/fetch.js";
import { buildFilterToQuery } from "../product/list/buildFilterToQuery.js";

function Price({ minPrice, maxPrice, maxSteps = 3, minRange = 50, areaProps }) {
    const getSteps = () => {
        let stepNumber = Math.min((parseFloat(maxPrice) - parseFloat(minPrice)) / parseFloat(minRange), maxSteps);
        if (stepNumber <= 1) return [{ from: minPrice, to: maxPrice }];else {
            let step = Math.round((parseFloat(maxPrice) - parseFloat(minPrice)) / stepNumber);
            let steps = [];
            let prev = minPrice;
            for (let i = 0; i < stepNumber; i++) {
                let from = prev;
                let to = Math.round(prev + step);
                prev = to;
                if (to > maxPrice) to = maxPrice;
                steps.push({ from: from, to: to });
            }

            return steps;
        }
    };

    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));
    const steps = getSteps();
    return React.createElement(
        "div",
        { className: "row" },
        React.createElement(
            "div",
            { className: "header price-header" },
            React.createElement(
                "div",
                { className: "title uk-margin-small-bottom" },
                React.createElement(
                    "strong",
                    null,
                    "Price"
                )
            ),
            React.createElement(
                "div",
                { className: "filter uk-margin-small-bottom" },
                steps.map((s, i) => {
                    const _from = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(s.from);
                    const _to = new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(s.to);
                    return React.createElement(
                        "div",
                        { key: i },
                        React.createElement(
                            "a",
                            { href: "#", onClick: e => {
                                    e.preventDefault();areaProps.updateFilter('price', 'BETWEEN', `${s.from} AND ${s.to}`);
                                } },
                            React.createElement(
                                "span",
                                null,
                                _from,
                                " to ",
                                _to
                            )
                        )
                    );
                })
            )
        )
    );
}

function Attributes({ attributes, areaProps }) {
    const onChange = (e, attributeCode, optionId) => {
        let filter = undefined;
        for (let key in areaProps.filters) {
            if (areaProps.filters.hasOwnProperty(key) && key === attributeCode) filter = areaProps.filters[key];
        }

        if (filter === undefined) {
            if (e.target.checked === false) {
                return;
            } else {
                areaProps.updateFilter(attributeCode, "IN", [optionId]);
            }
        } else {
            if (e.target.checked === false) {
                let value = _.isNumber(filter.value) ? [filter.value].filter(v => {
                    return v != optionId;
                }) : filter.value.split(",").filter(v => {
                    return v != optionId;
                });
                if (value.length == 0) areaProps.updateFilter(attributeCode, "=", undefined);else areaProps.updateFilter(attributeCode, "IN", value);
            } else {
                let value = _.isNumber(filter.value) ? [filter.value] : filter.value.split(",");
                areaProps.updateFilter(attributeCode, "IN", value.concat(optionId));
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
                        let value = _.get(areaProps.filters, a.attribute_code + ".value", "");
                        return React.createElement(
                            "li",
                            { key: j },
                            React.createElement(
                                "label",
                                null,
                                React.createElement("input", {
                                    className: "uk-checkbox",
                                    type: "checkbox",
                                    checked: _.isNumber(value) === true ? value === o.option_id : value.split(",").includes(o.option_id.toString()),
                                    onChange: e => onChange(e, a.attribute_code, o.option_id) }),
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

export default function Filter({ title }) {
    const productCollectionFilter = ReactRedux.useSelector(state => _.get(state, 'appState.productCollectionFilter'));
    const [data, setData] = React.useState(null);
    const apiUrl = ReactRedux.useSelector(state => {
        return _.get(state, 'appState.graphqlApi');
    });
    const currentUrl = ReactRedux.useSelector(state => {
        return _.get(state, 'appState.currentUrl');
    });

    React.useEffect(() => {
        let formData = new FormData();
        formData.append("query", "{productFilterTool {price {minPrice maxPrice } attributes {attribute_name attribute_code options {option_id option_text} } }}");
        Fetch(apiUrl, false, 'POST', formData, null, response => {
            if (_.get(response, 'payload.data.productFilterTool')) {
                setData(_.get(response, 'payload.data.productFilterTool'));
            }
        });
    }, []);

    const updateFilter = (key, operator, value) => {
        let f = {};
        if (_.isEmpty(productCollectionFilter)) f[key] = { operator: operator, value: value };else for (let k in productCollectionFilter) {
            if (productCollectionFilter.hasOwnProperty(k) && k !== 'page' && k !== 'limit' && k !== 'sortBy' && k !== 'sortOrder') {
                if (k !== key) f[k] = productCollectionFilter[k];else {
                    if (value !== undefined && !_.isEmpty(value)) f[key] = { operator: operator, value: value };
                }
            }
        }
        if (productCollectionFilter[key] === undefined) f[key] = { operator: operator, value: value };
        let url = new URL(currentUrl);
        url.searchParams.set('query', buildFilterToQuery(f));
        Fetch(url, true, "GET");
    };

    const cleanFilter = () => {
        let f = {};
        for (let k in productCollectionFilter) {
            if (productCollectionFilter.hasOwnProperty(k) && (k !== 'page' || k !== 'limit' || k !== 'sortBy' || k !== 'sortOrder')) {
                f[k] = productCollectionFilter[k];
            }
        }
        let url = new URL(currentUrl);
        url.searchParams.set('query', buildFilterToQuery(f));
        Fetch(url, true, "GET");
    };

    return React.createElement(Area, {
        id: "category-info",
        updateFilter: updateFilter,
        cleanFilter: cleanFilter,
        filters: productCollectionFilter,
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