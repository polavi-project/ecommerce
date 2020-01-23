import Area from "../../../../../../../../js/production/area.js";
import {Fetch} from "../../../../../../../../js/production/fetch.js";

function IdColumnHeader({filters, removeFilter, updateFilter, areaProps}) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            if(filterTo.current.value == "" && filterFrom.current.value == "")
                removeFilter("id");
            else
                updateFilter("id", "BETWEEN", `${filterFrom.current.value} AND ${filterTo.current.value}`)
        }
    };

    React.useEffect(() => {
        areaProps.addField("product_id");
    }, []);

    React.useEffect(() => {
        filterFrom.current.value = filters.findIndex((e)=> e.key === 'id') === -1 ? "" : filterFrom.current.value;
        filterTo.current.value = filters.findIndex((e)=> e.key === 'id') === -1 ? "" : filterTo.current.value;
    });

    return <th className={"column"}>
        <div className="header id-header">
            <div className={"title"}><span>ID</span></div>
            <div className={"filter"}>
                <div>
                    <input
                        type={"text"}
                        ref={filterFrom}
                        onKeyPress={(e) => onKeyPress(e)}
                        placeholder={"From"}
                        className="uk-input uk-form-small uk-form-width-small"
                    />
                </div>
                <div>
                    <input
                        type={"text"}
                        ref={filterTo}
                        onKeyPress={(e) => onKeyPress(e)}
                        placeholder={"To"}
                        className="uk-input uk-form-small uk-form-width-small"
                    />
                </div>
            </div>
        </div>
    </th>
}

function IdColumnRow({row}) {
    return <td>{row.product_id}</td>
}

function SkuColumnHeader({filters, removeFilter, updateFilter, areaProps}) {
    const filterInput = React.useRef(null);

    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            if(e.target.value == "")
                removeFilter("sku");
            else
                updateFilter("sku", "LIKE", `%${e.target.value}%`)
        }
    };

    React.useEffect(() => {
        areaProps.addField("sku");
    }, []);

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'sku') === -1 ? "" : filterInput.current.value;
    });

    return <th className={"column"}>
        <div className="header id-header">
            <div className={"title"}><span>SKU</span></div>
            <div className={"filter"}>
                <input
                    type={"text"}
                    ref={filterInput}
                    onKeyPress={(e) => onKeyPress(e)}
                    placeholder={"Sku"}
                    className="uk-input uk-form-small uk-form-width-small"
                />
            </div>
        </div>
    </th>
}

function SkuColumnRow({row}) {
    return <td>{row.sku}</td>
}

function PriceColumnHeader({removeFilter, filters, updateFilter, areaProps}) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            if(filterTo.current.value == "" && filterFrom.current.value == "")
                removeFilter("price");
            else
                updateFilter("price", "BETWEEN", `${filterFrom.current.value} AND ${filterTo.current.value}`)
        }
    };

    React.useEffect(() => {
        areaProps.addField("price");
    }, []);

    React.useEffect(() => {
        filterFrom.current.value = filters.findIndex((e)=> e.key === 'price') === -1 ? "" : filterFrom.current.value;
        filterTo.current.value = filters.findIndex((e)=> e.key === 'price') === -1 ? "" : filterTo.current.value;
    });

    return <th>
        <div className="header price-header">
            <div className={"title"}><span>Price</span></div>
            <div className={"filter"}>
                <div>
                    <input
                        type={"text"}
                        ref={filterFrom}
                        onKeyPress={(e) => onKeyPress(e)}
                        placeholder={"From"}
                        className="uk-input uk-form-small uk-form-width-small"
                    />
                </div>
                <div>
                    <input
                        type={"text"}
                        ref={filterTo}
                        onKeyPress={(e) => onKeyPress(e)}
                        placeholder={"To"}
                        className="uk-input uk-form-small uk-form-width-small"
                    />
                </div>
            </div>
        </div>
    </th>
}

function PriceColumnRow({row}) {
    const currency = ReactRedux.useSelector(state => _.get(state, 'appState.currency', 'USD'));
    const price = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(row.price);
    return <td>{price}</td>
}

function NameColumnHeader({filters, removeFilter, updateFilter, areaProps}) {
    const filterInput = React.useRef(null);

    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            if(e.target.value == "")
                removeFilter("name");
            else
                updateFilter("name", "LIKE", `%${e.target.value}%`)
        }
    };

    React.useEffect(() => {
        areaProps.addField('name');
    }, []);

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'name') === -1 ? "" : filterInput.current.value;
    });

    return <th className={"column"}>
        <div className="header name-header">
            <div className={"title"}><span>Product name</span></div>
            <div className={"filter"}>
                <input
                    type={"text"}
                    ref={filterInput}
                    onKeyPress={(e) => onKeyPress(e)}
                    placeholder={"Product name"}
                    className="uk-input uk-form-small uk-form-width-medium"
                />
            </div>
        </div>
    </th>
}

function NameColumnRow({row}) {
    return <td>{row.name}</td>
}

function QtyColumnHeader({areaProps, filters, removeFilter, updateFilter}) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            if(filterTo.current.value == "" && filterFrom.current.value == "")
                removeFilter("qty");
            else
                updateFilter("qty", "BETWEEN", `${filterFrom.current.value} AND ${filterTo.current.value}`)
        }
    };

    React.useEffect(() => {
        areaProps.addField('qty');
    }, []);

    React.useEffect(() => {
        filterFrom.current.value = filters.findIndex((e)=> e.key === 'qty') === -1 ? "" : filterFrom.current.value;
        filterTo.current.value = filters.findIndex((e)=> e.key === 'qty') === -1 ? "" : filterTo.current.value;
    });

    return <th className={"column"}>
        <div className="header name-header">
            <div className={"title"}><span>Qty</span></div>
            <div className={"filter"}>
                <div>
                    <input
                        type={"text"}
                        ref={filterFrom}
                        onKeyPress={(e) => onKeyPress(e)}
                        placeholder={"From"}
                        className="uk-input uk-form-small uk-form-width-small"
                    />
                </div>
                <div>
                    <input
                        type={"text"}
                        ref={filterTo}
                        onKeyPress={(e) => onKeyPress(e)}
                        placeholder={"To"}
                        className="uk-input uk-form-small uk-form-width-small"
                    />
                </div>
            </div>
        </div>
    </th>
}

function QtyColumnRow({row}) {
    return <td>{row.qty}</td>
}

function ThumbColumnHeader({areaProps})
{
    React.useEffect(() => {
        areaProps.addField("image { thumb }");
    }, []);
    return <th className={"column"}>
        <div className="header thumb-header">
            <div className={"title"}><span>Thumbnail</span></div>
        </div>
    </th>
}

function ThumbColumnRow({row}) {
    if(_.get(row, "image.thumb"))
        return <td><img className={'product-thumbnail table-row-img'} src={row.image.thumb}/></td>;
    else
        return <td><span uk-icon="icon: image; ratio: 3"></span></td>;
}

function StatusColumnHeader({areaProps, filters, updateFilter})
{
    const filterInput = React.useRef(null);

    const onChange = (e) => {
        updateFilter("status", "=", `${e.target.value}`)
    };

    React.useEffect(() => {
        areaProps.addField("status");
    }, []);

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'status') === -1 ? null : filterInput.current.value;
    });

    return <th className={"column"}>
        <div className="header status-header">
            <div className={"title"}><span>Status</span></div>
            <div className={"filter"}>
                <select
                    ref={filterInput}
                    onChange={(e)=> onChange(e)}
                    className="uk-select uk-form-small uk-form-width-small"
                >
                    <option value={1}>Enabled</option>
                    <option value={0}>Disabled</option>
                </select>
            </div>
        </div>
    </th>
}

function StatusColumnRow({row}) {
    if(parseInt(_.get(row, "status")) === 1)
        return <td><span className="uk-label uk-label-success">Enable</span></td>;
    else
        return <td><span className="uk-label uk-label-danger">Disabled</span></td>;
}

export default function ProductGrid({apiUrl, areaProps})
{
    const [products, setProducts] = React.useState([]);
    const [fields, setFields] = React.useState([]);

    const addField = (field) => {
        setFields(prevFields => prevFields.concat(field));
    };

    const applyFilter = () => {
        let formData = new FormData();
        formData.append('query', buildQuery());

        Fetch(
            apiUrl,
            false,
            'POST',
            formData,
            null,
            (response) => {
                if(_.get(response, 'payload.data.productCollection.products')) {
                    setProducts(_.get(response, 'payload.data.productCollection.products'));
                }
            }
        );
    };

    const buildQuery = () => {
        let filterStr = "";
        areaProps.filters.forEach((f,i) => {
            filterStr +=`${f.key} : {operator : "${f.operator}" value: "${f.value}"} `;
        });
        filterStr = filterStr.trim();
        if(filterStr)
            filterStr = `(filter : {${filterStr}})`;

        let fieldStr = "";
        fields.forEach((f,i) => {
            fieldStr +=`${f} `;
        });

        return `{productCollection ${filterStr} {products {${fieldStr}} total currentFilter}}`
    };

    React.useEffect(() => {
        if(fields.length === 0)
            return;
        applyFilter();
    }, [fields, areaProps.filters]);

    return <div className={"uk-overflow-auto"}>
        <table className="uk-table uk-table-small uk-table-divider">
            <thead>
            <Area
                className={""}
                id={"product_grid_header"}
                filters={areaProps.filters}
                addFilter={areaProps.addFilter}
                updateFilter={areaProps.updateFilter}
                removeFilter={areaProps.removeFilter}
                cleanFilter={areaProps.cleanFilter}
                addField={addField}
                applyFilter={applyFilter}
                reactcomponent={"tr"}
                coreWidgets={[
                    {
                        component: IdColumnHeader,
                        props : {...areaProps, addField, applyFilter},
                        sort_order: 10,
                        id: "id"
                    },
                    {
                        component: SkuColumnHeader,
                        props : {...areaProps, addField, applyFilter},
                        sort_order: 15,
                        id: "sku"
                    },
                    {
                        component: ThumbColumnHeader,
                        props : {...areaProps, addField, applyFilter},
                        sort_order: 20,
                        id: "thumb"
                    },
                    {
                        component: NameColumnHeader,
                        props : {...areaProps, addField, applyFilter},
                        sort_order: 30,
                        id: "name"
                    },
                    {
                        component: StatusColumnHeader,
                        props : {...areaProps, addField, applyFilter},
                        sort_order: 40,
                        id: "status"
                    },
                    {
                        component: QtyColumnHeader,
                        props : {...areaProps, addField, applyFilter},
                        sort_order: 50,
                        id: "qty"
                    },
                    {
                        component: PriceColumnHeader,
                        props : {...areaProps, addField, applyFilter},
                        sort_order: 60,
                        id: "price"
                    }
                ]}
            />
            </thead>
            <tbody>
            {products.map((p, i)=> {
                return <Area
                    key={i}
                    className={""}
                    id={"product_grid_row"}
                    row={p}
                    reactcomponent={"tr"}
                    coreWidgets={[
                        {
                            component: IdColumnRow,
                            props : {row: p},
                            sort_order: 10,
                            id: "id"
                        },
                        {
                            component: SkuColumnRow,
                            props : {row: p},
                            sort_order: 15,
                            id: "sku"
                        },
                        {
                            component: ThumbColumnRow,
                            props : {row: p},
                            sort_order: 20,
                            id: "thumb"
                        },
                        {
                            component: NameColumnRow,
                            props : {row: p},
                            sort_order: 30,
                            id: "name"
                        },
                        {
                            component: StatusColumnRow,
                            props : {row: p},
                            sort_order: 40,
                            id: "status"
                        },
                        {
                            component: QtyColumnRow,
                            props : {row: p},
                            sort_order: 50,
                            id: "qty"
                        },
                        {
                            component: PriceColumnRow,
                            props : {row: p},
                            sort_order: 60,
                            id: "price"
                        }
                    ]}
                />
            })}
            </tbody>
        </table>
        {products.length === 0 &&
        <div>There is no product to display</div>
        }
    </div>
}