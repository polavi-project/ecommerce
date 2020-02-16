import Area from "../../../../../../../js/production/area.js";
import A from "../../../../../../../js/production/a.js";
import {Fetch} from "../../../../../../../js/production/fetch.js";

function IdColumnHeader({areaProps}) {
    React.useEffect(() => {
        areaProps.addField("coupon_id");
    }, []);

    return <th>
        <div className="header id-header">
            <div className={"title"}><span>ID</span></div>
        </div>
    </th>
}

function IdColumnRow({row}) {
    return <td><span>{row.coupon_id}</span></td>;
}

function CouponColumnHeader({filters, removeFilter, updateFilter, areaProps}) {
    const filterInput = React.useRef(null);

    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            if(e.target.value == "")
                removeFilter("coupon");
            else
                updateFilter("coupon", "LIKE", `%${e.target.value}%`)
        }
    };

    React.useEffect(() => {
        areaProps.addField("coupon");
    }, []);

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'coupon') === -1 ? "" : filterInput.current.value;
    });

    return <th className={"column"}>
        <div className="header coupon-header">
            <div className={"title"}><span>Coupon</span></div>
            <div className={"filter"}>
                <input
                    type={"text"}
                    ref={filterInput}
                    onKeyPress={(e) => onKeyPress(e)}
                    placeholder={"Coupon"}
                    className="uk-input uk-form-small uk-form-width-small"
                />
            </div>
        </div>
    </th>
}

function CouponColumnRow({row}) {
    return <td>{row.coupon}</td>
}

function DescriptionColumnHeader({filters, removeFilter, updateFilter, areaProps}) {
    const filterInput = React.useRef(null);

    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            if(e.target.value == "")
                removeFilter("description");
            else
                updateFilter("description", "LIKE", `%${e.target.value}%`)
        }
    };

    React.useEffect(() => {
        areaProps.addField("description");
    }, []);

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'description') === -1 ? "" : filterInput.current.value;
    });

    return <th className={"column"}>
        <div className="header coupon-header">
            <div className={"title"}><span>Description</span></div>
            <div className={"filter"}>
                <input
                    type={"text"}
                    ref={filterInput}
                    onKeyPress={(e) => onKeyPress(e)}
                    placeholder={"Description"}
                    className="uk-input uk-form-small uk-form-width-small"
                />
            </div>
        </div>
    </th>
}

function DescriptionColumnRow({row}) {
    return <td><span>{_.get(row, 'description' , '')}</span></td>;
}

function ActionColumnHeader({areaProps}) {
    React.useEffect(() => {
        areaProps.addField('coupon_id');
        areaProps.addField('editUrl');
    }, []);

    const onClick = () => {
        areaProps.cleanFilter();
    };

    return <th className={"column"}>
        <div className="header">
            <div className={"title"}><span>Action</span></div>
            <a onClick={()=>onClick()}>Clean filter</a>
        </div>
    </th>
}

function ActionColumnRow({row}) {
    return <td>
        <div><A url={_.get(row, 'editUrl' , '')} text={"Edit"}/></div>
    </td>
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

function FreeShippingColumnHeader({areaProps, filters, updateFilter})
{
    const filterInput = React.useRef(null);

    const onChange = (e) => {
        updateFilter("free_shipping", "=", `${e.target.value}`)
    };

    React.useEffect(() => {
        areaProps.addField("free_shipping");
    }, []);

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'free_shipping') === -1 ? null : filterInput.current.value;
    });

    return <th className={"column"}>
        <div className="header status-header">
            <div className={"title"}><span>Free shipping?</span></div>
            <div className={"filter"}>
                <select
                    ref={filterInput}
                    onChange={(e)=> onChange(e)}
                    className="uk-select uk-form-small uk-form-width-small"
                >
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                </select>
            </div>
        </div>
    </th>
}

function FreeShippingColumnRow({row}) {
    if(parseInt(_.get(row, "free_shipping")) === 1)
        return <td><span className="uk-label uk-label-success">Yes</span></td>;
    else
        return <td><span className="uk-label uk-label-danger">No</span></td>;
}

export default function CouponGrid({apiUrl, areaProps})
{
    const [coupons, setCoupons] = React.useState([]);
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
                if(_.get(response, 'payload.data.couponCollection.coupons')) {
                    setCoupons(_.get(response, 'payload.data.couponCollection.coupons'));
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

        return `{couponCollection ${filterStr} {coupons {${fieldStr}} total currentFilter}}`
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
                id={"coupon_grid_header"}
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
                        component: CouponColumnHeader,
                        props : {...areaProps, addField, applyFilter},
                        sort_order: 20,
                        id: "coupon"
                    },
                    {
                        component: DescriptionColumnHeader,
                        props : {...areaProps, addField, applyFilter},
                        sort_order: 30,
                        id: "description"
                    },
                    {
                        component: FreeShippingColumnHeader,
                        props : {...areaProps, addField, applyFilter},
                        sort_order: 40,
                        id: "free_shipping"
                    },
                    {
                        component: StatusColumnHeader,
                        props : {...areaProps, addField, applyFilter},
                        sort_order: 50,
                        id: "status"
                    },
                    {
                        component: ActionColumnHeader,
                        props : {...areaProps, addField, applyFilter},
                        sort_order: 60,
                        id: "action"
                    }
                ]}
            />
            </thead>
            <tbody>
            {coupons.map((c, i)=> {
                return <Area
                    key={i}
                    className={""}
                    id={"coupon_grid_row"}
                    row={c}
                    reactcomponent={"tr"}
                    coreWidgets={[
                        {
                            component: IdColumnRow,
                            props : {row: c},
                            sort_order: 10,
                            id: "id"
                        },
                        {
                            component: CouponColumnRow,
                            props : {row: c},
                            sort_order: 20,
                            id: "coupon"
                        },
                        {
                            component: DescriptionColumnRow,
                            props : {row: c},
                            sort_order: 30,
                            id: "name"
                        },
                        {
                            component: FreeShippingColumnRow,
                            props : {row: c},
                            sort_order: 40,
                            id: "free_shipping"
                        },
                        {
                            component: StatusColumnRow,
                            props : {row: c},
                            sort_order: 50,
                            id: "status"
                        },
                        {
                            component: ActionColumnRow,
                            props : {row: c},
                            sort_order: 60,
                            id: "action"
                        }
                    ]}
                />
            })}
            </tbody>
        </table>
        {coupons.length === 0 &&
        <div>There is no coupon to display</div>
        }
    </div>
}