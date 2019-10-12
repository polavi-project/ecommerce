import Area from "../../../../../../../../js/production/area.js";

function IdColumn({areaProps}) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("product_id");
    }, []);

    return <td className={"column"}>
        <div className="header id-header">
            <div className={"title"}><span>ID</span></div>
            <div className={"filter"}>
                <div>
                    <input
                        type={"text"}
                        ref={filterFrom}
                        onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("id", "BETWEEN", `${e.target.value} AND ${filterTo.current.value}`);}}
                        placeholder={"From"}
                    />
                </div>
                <div>
                    <input
                        type={"text"}
                        ref={filterTo}
                        onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("id", "BETWEEN", `${filterFrom.current.value} AND ${e.target.value}`);}}
                        placeholder={"To"}
                    />
                </div>
            </div>
        </div>
        {areaProps.rows.map((r, i) => {
            return <div className={"row"} key={i}><span>{r.product_id}</span></div>;
        })}
    </td>
}

function PriceColumn({areaProps}) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("price");
    }, []);

    return <td className={"row"}>
        <div className="header price-header">
            <div className={"title"}><span>Price</span></div>
            <div className={"filter"}>
                <div>
                    <input
                        type={"text"}
                        ref={filterFrom}
                        onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("price", "BETWEEN", `${e.target.value} AND ${filterTo.current.value}`);}}
                        placeholder={"From"}
                    />
                </div>
                <div>
                    <input
                        type={"text"}
                        ref={filterTo}
                        onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("price", "BETWEEN", `${filterFrom.current.value} AND ${e.target.value}`);}}
                        placeholder={"To"}
                    />
                </div>
            </div>
        </div>
        {areaProps.rows.map((r, i) => {
            const _price = new Intl.NumberFormat(window.language, { style: 'currency', currency: window.currency }).format(_.get(r, 'price' , ''));
            return <div className={"row"} key={i}><span>{_price}</span></div>;
        })}
    </td>
}

function NameColumn({areaProps}) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('name');
    }, []);

    return <td className={"column"}>
        <div className="header name-header">
            <div className={"title"}><span>Product name</span></div>
            <div className={"filter"}>
                <input
                    type={"text"}
                    ref={filterInput}
                    onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("name", "LIKE", `%${e.target.value}%`);}}
                    placeholder={"Product name"}
                />
            </div>
        </div>
        {areaProps.rows.map((r, i) => {
            return <div className={"row"} key={i}><span>{_.get(r, 'name' , '')}</span></div>;
        })}
    </td>
}

function QtyColumn({areaProps}) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('qty');
    }, []);

    return <td className={"column"}>
        <div className="header name-header">
            <div className={"title"}><span>Qty</span></div>
            <div className={"filter"}>
                <div>
                    <input
                        type={"text"}
                        ref={filterFrom}
                        onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("qty", "BETWEEN", `${e.target.value} AND ${filterTo.current.value}`);}}
                        placeholder={"From"}
                    />
                </div>
                <div>
                    <input
                        type={"text"}
                        ref={filterTo}
                        onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("qty", "BETWEEN", `${filterFrom.current.value} AND ${e.target.value}`);}}
                        placeholder={"To"}
                    />
                </div>
            </div>
        </div>
        {areaProps.rows.map((r, i) => {
            return <div className={"row"} key={i}><span>{_.get(r, 'qty' , '')}</span></div>;
        })}
    </td>
}

function GeneralColumn({index, title, areaProps}) {
    React.useEffect(() => {
        areaProps.addField(index);
    }, []);
    return <td className={"column"}>
        <div className="header">
            <div className={"title"}><span>{title}</span></div>
        </div>
        {areaProps.rows.map((r, i) => {
            return <div className={"row"} key={i}><span>{_.get(r, index , '')}</span></div>;
        })}
    </td>
}

function ThumbColumn({areaProps})
{
    React.useEffect(() => {
        areaProps.addField("image { thumb }");
    }, []);
    return <td className={"column"}>
        <div className="header thumb-header">
            <div className={"title"}><span>Thumbnail</span></div>
        </div>
        {areaProps.rows.map((r, i) => {
            if(_.get(r, "image.thumb"))
                return <div key={i} className={"row"}><img className={'product-thumbnail'} src={r.image.thumb}/></div>;
            else
                return <div key={i} className={"row"}><span uk-icon="icon: image; ratio: 5"></span></div>;
        })}
    </td>
}

function StatusColumn({areaProps})
{
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("status");
    }, []);

    return <td className={"column"}>
        <div className="header status-header">
            <div className={"title"}><span>Status</span></div>
            <div className={"filter"}>
                <input type={"text"} ref={filterInput} onKeyPress={(e) => {
                    if(e.key === 'Enter') areaProps.addFilter("status", "Equal", e.target.value);
                }
                }/>
            </div>
        </div>
        {areaProps.rows.map((r, i) => {
            if(parseInt(_.get(r, "status")) === 1)
                return <div key={i} className={"row"}><span className="uk-label uk-label-success">Enable</span></div>;
            else
                return <div key={i} className={"row"}><span className="uk-label uk-label-danger">Disabled</span></div>;
        })}
    </td>
}

export default function ProductGrid({apiUrl, defaultFilter})
{
    const [products, setProducts] = React.useState([]);
    const [filters, setFilters] = React.useState(() => {
        if(defaultFilter !== undefined)
            return defaultFilter;
        else
            return [];
    });
    const [fields, setFields] = React.useState([]);

    const addFilter = (key, operator, value) => {
        let flag = 0;
        filters.forEach((f, i) => {
            if(f.key === key && !value)
                flag = 1; // Remove
            if(f.key === key && value)
                flag = 2; // Update
        });
        if(flag === 0)
            setFilters(prevFilters => prevFilters.concat({key: key, operator: operator, value: value}));
        else if(flag === 1) {
            const setFilters = prevFilters.filter((f, index) => f.key !== key);
            setFilters(newFilters);
        } else
            setFilters(prevFilters => prevFilters.map((f, i) => {
                if(f.key === key) {
                    f.operator = operator;
                    f.value = value;
                }
                return f;
            }));
    };

    const cleanFilter = () => {
        setFilters([]);
    };
    const addField = (field) => {
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
            if(response.headers['content-type'] !== "application/json")
                throw new Error('Something wrong, please try again');
            if(_.get(response, 'data.payload.data.productCollection.products')) {
                setProducts(_.get(response, 'data.payload.data.productCollection.products'));
            }
        }).catch(function (error) {
        }).finally(function() {
            // e.target.value = null;
            // setUploading(false);
        });
    };

    const buildQuery = () => {
        let filterStr = "";
        filters.forEach((f,i) => {
            filterStr +=`${f.key} : {operator : ${f.operator} value: "${f.value}"} `;
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
    }, [fields, filters]);

    React.useLayoutEffect(() => {
        // Fix height of row
        let maxHeightHeader = -1;
        jQuery('.column .header').each(function(e) {
            maxHeightHeader = maxHeightHeader > jQuery(this).height() ? maxHeightHeader : jQuery(this).height();
        });

        jQuery('.column .header').each(function() {
            jQuery(this).height(maxHeightHeader);
        });

        let maxHeightRow = -1;
        jQuery('.column .row').each(function(e) {
            maxHeightRow = maxHeightRow > jQuery(this).height() ? maxHeightRow : jQuery(this).height();
        });

        jQuery('.column .row').each(function() {
            jQuery(this).height(maxHeightRow);
        });
    });

    return <div className={""}>
        <table className="">
            <tbody>
            <Area
                className={""}
                id={"product-grid"}
                rows={products}
                addFilter={addFilter}
                cleanFilter={cleanFilter}
                addField={addField}
                applyFilter={applyFilter}
                reactcomponent={"tr"}
                coreWidgets={[
                    {
                        component: IdColumn,
                        props : {
                        },
                        sort_order: 10,
                        id: "id"
                    },
                    {
                        component: ThumbColumn,
                        props : {
                        },
                        sort_order: 20,
                        id: "thumb"
                    },
                    {
                        component: NameColumn,
                        props : {
                        },
                        sort_order: 30,
                        id: "name"
                    },
                    {
                        component: StatusColumn,
                        props : {
                        },
                        sort_order: 40,
                        id: "status"
                    },
                    {
                        component: QtyColumn,
                        props : {
                        },
                        sort_order: 50,
                        id: "qty"
                    },
                    {
                        component: PriceColumn,
                        props : {
                        },
                        sort_order: 60,
                        id: "price"
                    }
                ]}
            />
            </tbody>
        </table>
        {products.length === 0 &&
        <div>There is no product to display</div>
        }
    </div>
}