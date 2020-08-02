import Area from "../../../../../../../js/production/area.js";
import {Fetch} from "../../../../../../../js/production/fetch.js";
import {buildFilterToQuery} from "../product/list/buildFilterToQuery.js";

function Price({minPrice = 0, maxPrice = 0, price_max_step, price_min_range, areaProps}) {
    const getSteps = (minPrice = 0, maxPrice = 0, price_max_step, price_min_range) => {
        let range = parseFloat(maxPrice) - parseFloat(minPrice);
        let steps = [];
        if(range / price_min_range <= price_max_step) {
            var next = minPrice;
            while(next < maxPrice)
                steps.push({from: next, to: next + price_min_range});
        } else {
            let step = Math.round((parseFloat(maxPrice) - parseFloat(minPrice)) / price_max_step);
            let prev = minPrice;
            for (let i = 0; i < price_max_step; i++) {
                let from = prev;
                let to = Math.round(prev + step);
                prev=to;
                if(to > maxPrice)
                    to = maxPrice;
                steps.push({from: from, to: to});
            }

            return steps;
        }
    };

    const [steps, setSteps] = React.useState([]);
    const currentFilter = ReactRedux.useSelector(state => _.get(_.get(state, "appState.productCollectionFilter", []).find((f) => f["key"] === "price"), "value", null));
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const language = ReactRedux.useSelector(state => _.get(state, 'appState.language[0]', 'en'));

    React.useEffect(()=>{
        setSteps(getSteps(minPrice, maxPrice, price_max_step, price_min_range));
    }, [minPrice, maxPrice]);

    return <div>
        <div><strong>Price</strong></div>
        <ul className="list-basic">
            {steps.map((s, i) => {
                const from = s.from ? new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(s.from) : "-";
                const to = s.to ? new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(s.to) : "-";
                return <li key={i}><label>
                    <input
                        className=""
                        type={"checkbox"}
                        value={`${s.from}-${s.to}`}
                        checked={currentFilter === `${s.from}-${s.to}`}
                        onChange={(e)=> areaProps.updateFilter("price", "BETWEEN", e.target.value)}/> <span className="option-name">{`${from} - ${to}`}</span></label>
                </li>
            })}
        </ul>
    </div>
}

function Attributes({attributes, areaProps}) {
    const onChange = (e, attributeCode, optionId) => {
        let filter = undefined;
        areaProps.filters.forEach((f) => {
            if(f["key"] === attributeCode)
                filter = f;
        });

        if(filter === undefined) {
            if(e.target.checked === false) {
                return;
            } else {
                areaProps.updateFilter(
                    attributeCode,
                    "IN",
                    [optionId]
                );
            }
        } else {
            if(e.target.checked === false) {
                let value = _.isNumber(filter.value) ? [filter.value].filter((v)=> { return v != optionId; }) : filter.value.split(",").filter((v)=> { return v != optionId; });
                if(value.length == 0)
                    areaProps.updateFilter(
                        attributeCode,
                        "=",
                        undefined
                    );
                else
                    areaProps.updateFilter(
                        attributeCode,
                        "IN",
                        value
                    );
            } else {
                let value = _.isNumber(filter.value) ? [filter.value] : filter.value.split(",");
                areaProps.updateFilter(
                    attributeCode,
                    "IN",
                    value.concat(optionId)
                )
            }
        }
    };

    return <div className={"filter-attributes"}>
        {attributes.map((a, i) => {
            return <div key={i}>
                <div><strong>{a.attribute_name}</strong></div>
                <ul className="list-basic">
                    {a.options.map((o, j) => {
                        let value = _.get(areaProps.filters.find((f) => f["key"] === a.attribute_code), "value", "");
                        return <li key={j}><label>
                            <input
                                className=""
                                type={"checkbox"}
                                checked={_.isNumber(value) === true ? value === o.option_id : value.split(",").includes(o.option_id.toString())}
                                onChange={(e)=> onChange(e, a.attribute_code, o.option_id)}/><span className="option-name">{o.option_text}</span></label>
                        </li>
                    })}
                </ul>
            </div>
        })}
    </div>
}

export default function Filter({title, price_max_step, price_min_range}) {
    const productCollectionFilter = ReactRedux.useSelector(state => _.get(state, 'appState.productCollectionFilter'));
    const [data, setData] = React.useState(null);
    const apiUrl = ReactRedux.useSelector(state => {return _.get(state, 'appState.graphqlApi')});
    const currentUrl = ReactRedux.useSelector(state => {return _.get(state, 'appState.currentUrl')});
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        let formData = new FormData();
        formData.append("query", "{productFilterTool {price {minPrice maxPrice } attributes {attribute_name attribute_code options {option_id option_text} } }}");
        Fetch(
            apiUrl,
            false,
            'POST',
            formData,
            null,
            (response) => {
                if(_.get(response, 'payload.data.productFilterTool')) {
                    setData(_.get(response, 'payload.data.productFilterTool'));
                }
            }
        );
    }, []);

    const updateFilter = (key, operator, value) => {
        let fs = [];
        if(_.isEmpty(productCollectionFilter))
            fs.push({key: key, operator: operator, value: value});
        else
            productCollectionFilter.forEach((f) => {
                if(f["key"] !== 'page' && f["key"] !== 'limit' && f["key"] !== 'sort-by' && f["key"] !== 'sort-order') {
                    if (f["key"] !== key)
                        fs.push(f);
                    else {
                        if (value !== undefined && !_.isEmpty(value))
                            fs.push({key: key, operator: operator, value: value});
                    }
                }
            });
        if(productCollectionFilter.find((f) => f["key"] === key) === undefined)
            fs.push({key: key, operator: operator, value: value});
        console.log(fs);
        Fetch(buildFilterToQuery(currentUrl, fs), true, "GET");
    };

    const cleanFilter = () => {
        let f = [];
        for (let k in productCollectionFilter) {
            if (productCollectionFilter.hasOwnProperty(k) && (k !== 'page' || k !== 'limit' || k !== 'sortBy' || k !== 'sortOrder')) {
                f[k] = productCollectionFilter[k];
            }
        }
        Fetch(buildFilterToQuery(currentUrl, f), true, "GET");
    };

    return <Area
        id={"category-info"}
        updateFilter={updateFilter}
        cleanFilter={cleanFilter}
        filters={productCollectionFilter}
        className={"product-filter-tool"}
        coreWidgets={[
            {
                component: () => <div className="filter-title">{title}</div>,
                sort_order: 0,
                id: "filter-tool-title"
            },
            {
                component: Price,
                props : {minPrice: _.get(data, 'price.minPrice', ""), maxPrice: _.get(data, 'price.maxPrice', ""), price_min_range, price_max_step},
                sort_order: 10,
                id: "filter-price"
            },
            {
                component: Attributes,
                props : {attributes: _.get(data, 'attributes', [])},
                sort_order: 20,
                id: "filter-attributes"
            }
        ]}
    />
}