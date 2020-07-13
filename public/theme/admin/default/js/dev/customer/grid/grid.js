import Area from "../../../../../../../js/production/area.js";
import A from "../../../../../../../js/production/a.js";
import {Fetch} from "../../../../../../../js/production/fetch.js";
import Pagination from "../../../../../../../js/production/grid/pagination.js";

function IdColumnHeader({areaProps}) {
    React.useEffect(() => {
        areaProps.addField("customer_id");
    }, []);

    return <th>
        <div className="table-header id-header">
            <div className={"title"}><span>ID</span></div>
        </div>
    </th>
}

function IdColumnRow({row}) {
    return <td><span>{row.customer_id}</span></td>;
}

function EmailColumnHeader({filters, removeFilter, updateFilter, areaProps}) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('email');
    }, []);

    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            if(e.target.value == "")
                removeFilter("email");
            else
                updateFilter("email", "LIKE", `%${e.target.value}%`)
        }
    };

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'email') === -1 ? "" : filterInput.current.value;
    });

    return <th>
        <div className="table-header name-header">
            <div className={"title"}><span>Email</span></div>
            <div className={"filter"}>
                <input
                    type={"text"}
                    ref={filterInput}
                    onKeyPress={(e) => onKeyPress(e)}
                    placeholder={"Email"}
                    className="form-control"
                />
            </div>
        </div>
    </th>
}

function EmailColumnRow({row}) {
    return <td><span>{_.get(row, 'email' , '')}</span></td>;
}

function NameColumnHeader({filters, removeFilter, updateFilter, areaProps}) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('full_name');
    }, []);

    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            if(e.target.value == "")
                removeFilter("full_name");
            else
                updateFilter("full_name", "LIKE", `%${e.target.value}%`)
        }
    };

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'full_name') === -1 ? "" : filterInput.current.value;
    });

    return <th>
        <div className="table-header name-header">
            <div className={"title"}><span>Full name</span></div>
            <div className={"filter"}>
                <input
                    type={"text"}
                    ref={filterInput}
                    onKeyPress={(e) => onKeyPress(e)}
                    placeholder={"Full name"}
                    className="form-control"
                />
            </div>
        </div>
    </th>
}

function NameColumnRow({row}) {
    return <td><span>{_.get(row, 'full_name' , '')}</span></td>;
}

function GroupColumnHeader({areaProps, filters, updateFilter, groups})
{
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("group_id");
    }, []);

    const onChange = (e) => {
        updateFilter("group", "=", `${e.target.value}`)
    };

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'group') === -1 ? null : filterInput.current.value;
    });

    return <th>
        <div className="table-header status-header">
            <div className={"title"}><span>Customer group</span></div>
            <div className={"filter"}>
                <select
                    ref={filterInput}
                    onChange={(e)=> onChange(e)}
                    className="form-control"
                >
                    {groups.map((g, i) => {
                        return <option key={i} value={g.customer_group_id}>{g.group_name}</option>
                    })}
                </select>
            </div>
        </div>
    </th>
}

function GroupColumnRow({row, groups}) {
    let group = groups.find((g)=> parseInt(g.customer_group_id) === parseInt(row.group_id));
    return <td><span>{group.group_name}</span></td>;
}

function ActionColumnHeader({areaProps}) {
    React.useEffect(() => {
        areaProps.addField('customer_id');
        areaProps.addField('editUrl');
    }, []);

    const onClick = () => {
        areaProps.cleanFilter();
    };

    return <th className="column action-column">
        <div className="table-header">
            <div className={"title"}><span></span></div>
            <div className="filter">
                <a onClick={()=>onClick()} className="text-danger" title="Clear filter" href="javascript:void(0)">
                    <i className="fa fa-filter"></i>
                    <i className="fa fa-slash" style={{marginLeft: "-13px"}}></i>
                </a>
            </div>
        </div>
    </th>
}

function ActionColumnRow({row}) {
    return <td>
        <div>
            <A url={row.editUrl}><i className="fas fa-edit"></i></A>
        </div>
    </td>;
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
        <div className="table-header status-header">
            <div className={"title"}><span>Status</span></div>
            <div className={"filter"}>
                <select
                    ref={filterInput}
                    onChange={(e)=> onChange(e)}
                    className="form-control"
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
        return <td><span className="badge badge-success">Enable</span></td>;
    else
        return <td><span className="badge badge-secondary">Disabled</span></td>;
}

export default function CustomerGrid({apiUrl, areaProps, groups=[]})
{
    const [customers, setCustomers] = React.useState([]);
    const [fields, setFields] = React.useState([]);
    const [total, setTotal] = React.useState(0);

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
                if(_.get(response, 'payload.data.customerCollection.customers')) {
                    setCustomers(_.get(response, 'payload.data.customerCollection.customers'));
                    setTotal(_.get(response, 'payload.data.customerCollection.total'));
                }
            }
        );
    };

    const buildQuery = () => {
        let filters = [];
        areaProps.filters.forEach((f,i) => {
            filters.push(`{key: "${f.key}" operator: "${f.operator}" value: "${f.value}"}`);
        });
        let filterStr = filters.length > 0 ? `[${filters.join(",")}]` : "[]";

        let fieldStr = "";
        fields.forEach((f,i) => {
            fieldStr +=`${f} `;
        });

        return `{customerCollection (filters : ${filterStr}) {customers {${fieldStr}} total currentFilter}}`
    };

    React.useEffect(() => {
        if(fields.length === 0)
            return;
        applyFilter();
    }, [fields, areaProps.filters]);

    return <div className={"customer-grid mt-4"}>
        <table className="table table-bordered sticky">
            <thead>
                <tr>
                    <Area
                        className={""}
                        id={"customer_grid_header"}
                        filters={areaProps.filters}
                        addFilter={areaProps.addFilter}
                        updateFilter={areaProps.updateFilter}
                        removeFilter={areaProps.removeFilter}
                        cleanFilter={areaProps.cleanFilter}
                        addField={addField}
                        applyFilter={applyFilter}
                        noOuter={true}
                        coreWidgets={[
                            {
                                component: IdColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 10,
                                id: "id"
                            },
                            {
                                component: EmailColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 15,
                                id: "email"
                            },
                            {
                                component: NameColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 20,
                                id: "name"
                            },
                            {
                                component: GroupColumnHeader,
                                props : {...areaProps, addField, applyFilter, groups},
                                sort_order: 25,
                                id: "group"
                            },
                            {
                                component: StatusColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 30,
                                id: "status"
                            },
                            {
                                component: ActionColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 35,
                                id: "action"
                            }
                        ]}
                    />
                </tr>
            </thead>
            <tbody>
            {customers.map((c, i)=> {
                return <tr>
                    <Area
                        key={i}
                        className={""}
                        id={"customer_grid_row"}
                        row={c}
                        noOuter={true}
                        coreWidgets={[
                            {
                                component: IdColumnRow,
                                props : {row: c},
                                sort_order: 10,
                                id: "id"
                            },
                            {
                                component: EmailColumnRow,
                                props : {row: c},
                                sort_order: 15,
                                id: "email"
                            },
                            {
                                component: NameColumnRow,
                                props : {row: c},
                                sort_order: 20,
                                id: "name"
                            },
                            {
                                component: GroupColumnRow,
                                props : {row: c, groups},
                                sort_order: 25,
                                id: "group"
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
                                sort_order: 35,
                                id: "action"
                            }
                        ]}
                    />
                </tr>
            })}
            </tbody>
        </table>
        {customers.length === 0 &&
        <div>There is no customer to display</div>
        }
        <Pagination total={total} page={_.get(areaProps.filters.find((e)=> e.key === 'page'), 'value', 1)} limit={_.get(areaProps.filters.find((e)=> e.key === 'limit'), 'value', 20)} setFilter={areaProps.updateFilter}/>
    </div>
}