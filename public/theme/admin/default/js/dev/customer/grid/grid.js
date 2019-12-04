import Area from "../../../../../../../js/production/area.js";
import A from "../../../../../../../js/production/a.js";

function IdColumnHeader({areaProps}) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("customer_id");
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
    return <td><span>{row.customer_id}</span></td>;
}

function EmailColumnHeader({areaProps}) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('email');
    }, []);

    return <th>
        <div className="header name-header">
            <div className={"title"}><span>Email</span></div>
            <div className={"filter"}>
                <input
                    className="uk-input uk-form-small uk-form-width-small"
                    type={"text"}
                    ref={filterInput}
                    onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("email", "LIKE", `%${e.target.value}%`);}}
                    placeholder={"Email"}
                />
            </div>
        </div>
    </th>
}

function EmailColumnRow({row}) {
    return <td><span>{_.get(row, 'email' , '')}</span></td>;
}

function NameColumnHeader({areaProps}) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('full_name');
    }, []);

    return <th>
        <div className="header name-header">
            <div className={"title"}><span>Full name</span></div>
            <div className={"filter"}>
                <input
                    className="uk-input uk-form-small uk-form-width-small"
                    type={"text"}
                    ref={filterInput}
                    onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("full_name", "LIKE", `%${e.target.value}%`);}}
                    placeholder={"Full name"}
                />
            </div>
        </div>
    </th>
}

function NameColumnRow({row}) {
    return <td><span>{_.get(row, 'full_name' , '')}</span></td>;
}

function GroupColumnHeader({areaProps})
{
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("group_id");
    }, []);

    return <th>
        <div className="header status-header">
            <div className={"title"}><span>Customer group</span></div>
            <div className={"filter"}>
                <select
                    className="uk-select uk-form-small uk-form-width-small"
                    defaultValue={"placeholder"}
                    ref={filterInput}
                    onChange={(e)=> {
                    areaProps.addFilter("group", "Equal", e.target.value);
                    }}
                >
                    <option value="placeholder" disabled={true}>Please select</option>
                    {areaProps.groups.map((g, i) => {
                        return <option key={i} value={g.customer_group_id}>{g.group_name}</option>
                    })}
                </select>
            </div>
        </div>
    </th>
}

function GroupColumnRow({row, groups}) {
    let group = groups.find((g)=> parseInt(g.customer_group_id) === parseInt(row.group_id))
    return <td><span>{group.group_name}</span></td>;
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

    return <td>
        <div className="header status-header">
            <div className={"title"}><span>Status</span></div>
            <div className={"filter"}>
                <select className="uk-select uk-form-small" ref={filterInput} onChange={(e)=> {
                    areaProps.addFilter("status", "Equal", e.target.value);
                }}>
                    <option value={1}>Enabled</option>
                    <option value={0}>Disabled</option>
                </select>
            </div>
        </div>
    </td>
}

function StatusColumnRow({row}) {
    if(parseInt(_.get(row, "status")) === 1)
        return <td><span className="uk-label uk-label-success">Enable</span></td>;
    else
        return <td><span className="uk-label uk-label-danger">Disabled</span></td>;
}

export default function CmsPageGrid({apiUrl, groups = []})
{
    const [customers, setCustomers] = React.useState([]);
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
            if(_.get(response, 'data.payload.data.customerCollection.customers')) {
                setCustomers(_.get(response, 'data.payload.data.customerCollection.customers'));
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

        return `{customerCollection ${filterStr} {customers {${fieldStr}} total currentFilter}}`
    };

    React.useEffect(() => {
        if(fields.length === 0)
            return;
        applyFilter();
    }, [fields, filters]);

    return <div className={"uk-overflow-auto"}>
        <div><h3>Customers</h3></div>
        <table className="uk-table uk-table-small uk-table-divider">
            <thead>
            <Area
                className={""}
                id={"customer_grid_header"}
                addFilter={addFilter}
                cleanFilter={cleanFilter}
                addField={addField}
                applyFilter={applyFilter}
                groups={groups}
                reactcomponent={"tr"}
                coreWidgets={[
                    {
                        component: IdColumnHeader,
                        props : {},
                        sort_order: 10,
                        id: "id"
                    },
                    {
                        component: EmailColumnHeader,
                        props : {},
                        sort_order: 15,
                        id: "email"
                    },
                    {
                        component: NameColumnHeader,
                        props : {},
                        sort_order: 20,
                        id: "name"
                    },
                    {
                        component: GroupColumnHeader,
                        props : {},
                        sort_order: 25,
                        id: "group"
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
                        sort_order: 35,
                        id: "action"
                    }
                ]}
            />
            </thead>
            <tbody>
            {customers.map((p, i)=> {
                return <Area
                    key={i}
                    className={""}
                    id={"customer_grid_row"}
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
                            component: EmailColumnRow,
                            props : {row: p},
                            sort_order: 15,
                            id: "email"
                        },
                        {
                            component: NameColumnRow,
                            props : {row: p},
                            sort_order: 20,
                            id: "name"
                        },
                        {
                            component: GroupColumnRow,
                            props : {row: p, groups: groups},
                            sort_order: 25,
                            id: "group"
                        },
                        {
                            component: StatusColumnRow,
                            props : {row: p},
                            sort_order: 30,
                            id: "status"
                        },
                        {
                            component: ActionColumnRow,
                            props : {row: p},
                            sort_order: 35,
                            id: "action"
                        }
                    ]}
                />
            })}
            </tbody>
        </table>
        {customers.length === 0 &&
        <div>There is no customer to display</div>
        }
    </div>
}