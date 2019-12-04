import Area from "../../../../../../../js/production/area.js";
import A from "../../../../../../../js/production/a.js";

function IdColumnHeader({areaProps}) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("coupon_id");
    }, []);

    return <th>
        <div className="header id-header">
            <div className={"title"}><span>ID</span></div>
            <div className={"filter"}>
                <div>
                    <input
                        className="uk-input uk-form-small uk-form-width-small"
                        type={"text"}
                        ref={filterFrom}
                        onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("id", "BETWEEN", `${e.target.value} AND ${filterTo.current.value}`);}}
                        placeholder={"From"}
                    />
                </div>
                <div>
                    <input
                        className="uk-input uk-form-small uk-form-width-small"
                        type={"text"}
                        ref={filterTo}
                        onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("id", "BETWEEN", `${filterFrom.current.value} AND ${e.target.value}`);}}
                        placeholder={"To"}
                    />
                </div>
            </div>
        </div>
    </th>
}

function IdColumnRow({row}) {
    return <td><span>{row.coupon_id}</span></td>;
}
function DescriptionColumnHeader({areaProps}) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('description');
    }, []);

    return <th>
        <div className="header name-header">
            <div className={"title"}><span>Description</span></div>
            <div className={"filter"}>
                <input
                    className="uk-input uk-form-small uk-form-width-medium"
                    type={"text"}
                    ref={filterInput}
                    onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("description", "LIKE", `%${e.target.value}%`);}}
                    placeholder={"Description"}
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
        areaProps.addField('editUrl');
    }, []);
    return <th>
        <div className="header">
            <div className={"title"}><span>Action</span></div>
        </div>
    </th>
}

function ActionColumnRow({row}) {
    return <td><A url={_.get(row, 'editUrl' , '')} text={"Edit"}/></td>;
}

function StatusColumnHeader({areaProps})
{
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("status");
    }, []);

    return <th>
        <div className="header status-header">
            <div className={"title"}><span>Status</span></div>
            <div className={"filter"}>
                <select className="uk-select uk-form-small uk-form-width-small" ref={filterInput} onChange={(e)=> {
                    areaProps.addFilter("status", "Equal", e.target.value);
                }}>
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

export default function CouponGrid({apiUrl})
{
    const [coupons, setCoupons] = React.useState([]);
    const [filters, setFilters] = React.useState([]);
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
            if(_.get(response, 'data.payload.data.couponCollection.coupons')) {
                setCoupons(_.get(response, 'data.payload.data.couponCollection.coupons'));
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

        return `{couponCollection ${filterStr} {coupons {${fieldStr}} total currentFilter}}`
    };

    React.useEffect(() => {
        if(fields.length === 0)
            return;
        applyFilter();
    }, [fields, filters]);

    return <div className={"uk-overflow-auto"}>
        <table className="uk-table uk-table-small uk-table-divider">
            <thead>
            <Area
                className={""}
                id={"coupon_grid_header"}
                addFilter={addFilter}
                cleanFilter={cleanFilter}
                addField={addField}
                applyFilter={applyFilter}
                reactcomponent={"tr"}
                coreWidgets={[
                    {
                        component: IdColumnHeader,
                        props : {addFilter, cleanFilter, addField, applyFilter},
                        sort_order: 10,
                        id: "id"
                    },
                    {
                        component: DescriptionColumnHeader,
                        props : {},
                        sort_order: 20,
                        id: "name"
                    },
                    {
                        component: StatusColumnHeader,
                        props : {},
                        sort_order: 30,
                        id: "status"
                    },
                    {
                        component: ActionColumnHeader,
                        props : {},
                        sort_order: 40,
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
                            component: DescriptionColumnRow,
                            props : {row: c},
                            sort_order: 20,
                            id: "name"
                        },
                        {
                            component: StatusColumnRow,
                            props : {row: c},
                            sort_order: 30,
                            id: "status"
                        },
                        {
                            component: ActionColumnRow,
                            props : {row: c},
                            sort_order: 40,
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