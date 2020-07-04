import Area from "../../../../../../../js/production/area.js";
import {Fetch} from "../../../../../../../js/production/fetch.js";
import {buildFilterToQuery} from "../product/list/buildFilterToQuery.js";

function Price({minPrice = "", maxPrice = "", areaProps}) {
    const [min, setMin] = React.useState(null);
    const [max, setMax] = React.useState(null);
    const currentFilter = ReactRedux.useSelector(state => { return _.get(state, 'appState.productCollectionFilter.price.value', `${minPrice},${maxPrice}`).split(","); });
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));

    React.useEffect(()=>{
        setMin(currentFilter[0]);
        setMax(currentFilter[1]);
    }, [minPrice, maxPrice]);

    const onChangeMin = (e) => {
        setMin(e.target.value);
    };

    const onChangeMax = (e) => {
        setMax(e.target.value);
    };

    return <div className={"price-filter"}>
        <div className="title uk-margin-small-bottom"><strong>Price</strong></div>
        <div className="filter uk-margin-small-bottom">
            <div className="uk-flex">
                <div>
                    <div><span>From</span></div>
                    <div className="uk-inline">
                        <span className="uk-form-icon">{currency}</span>
                        <input
                            type="text"
                            className="uk-input uk-form-small"
                            value={min}
                            onChange={(e) => onChangeMin(e)}
                            onBlur={() => areaProps.updateFilter("price", "BETWEEN", `${min}-${max}`)}
                        />
                    </div>

                </div>
                <div>
                    <div><span>To</span></div>
                    <div className="uk-inline">
                        <span className="uk-form-icon">{currency}</span>
                        <input
                            type="text"
                            className="uk-input uk-form-small"
                            value={max}
                            onChange={(e) => onChangeMax(e)}
                            onBlur={() => areaProps.updateFilter("price", "BETWEEN", `${min}-${max}`)}
                        />
                    </div>
                </div>
            </div>
        </div>
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
                <ul className="uk-list">
                    {a.options.map((o, j) => {
                        let value = _.get(areaProps.filters.find((f) => f["key"] === a.attribute_code), "value", "");
                        return <li key={j}><label>
                            <input
                                className="uk-checkbox"
                                type={"checkbox"}
                                checked={_.isNumber(value) === true ? value === o.option_id : value.split(",").includes(o.option_id.toString())}
                                onChange={(e)=> onChange(e, a.attribute_code, o.option_id)}/> {o.option_text}</label>
                        </li>
                    })}
                </ul>
            </div>
        })}
    </div>
}

export default function Filter({title}) {
    const productCollectionFilter = ReactRedux.useSelector(state => _.get(state, 'appState.productCollectionFilter'));
    const [data, setData] = React.useState(null);
    const apiUrl = ReactRedux.useSelector(state => {return _.get(state, 'appState.graphqlApi')});
    const currentUrl = ReactRedux.useSelector(state => {return _.get(state, 'appState.currentUrl')});

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
        coreWidgets={[
            {
                component: Price,
                props : {minPrice: _.get(data, 'price.minPrice', ""), maxPrice: _.get(data, 'price.maxPrice', "")},
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