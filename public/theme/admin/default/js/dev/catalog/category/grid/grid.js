import Area from "../../../../../../../../js/production/area.js";
import A from "../../../../../../../../js/production/a.js";
import {Fetch} from "../../../../../../../../js/production/fetch.js";
import Pagination from "../../../../../../../../js/production/grid/pagination.js";

function IdColumnHeader({areaProps, filters, updateFilter}) {
    React.useEffect(() => {
        areaProps.addField("category_id");
    }, []);

    return <th>
        <div className="table-header id-header">
            <div className={"title"}><span>ID</span></div>
        </div>
    </th>
}

function IdColumnRow({row}) {
    return <td><span>{row.category_id}</span></td>
}

function NameColumnHeader({areaProps, filters, updateFilter}) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('name');
    }, []);

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'name') === -1 ? "" : filterInput.current.value;
    });

    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            if(e.target.value == "")
                removeFilter("name");
            else
                updateFilter("name", "LIKE", `%${e.target.value}%`)
        }
    };

    return <th>
        <div className="table-header name-header">
            <div className={"title"}><span>Category name</span></div>
            <div className={"filter"}>
                <input
                    type={"text"}
                    ref={filterInput}
                    onKeyPress={(e) => onKeyPress(e)}
                    placeholder={"Category name"}
                    className="form-control"
                />
            </div>
        </div>
    </th>
}

function NameColumnRow({row}) {
    return <td><span>{row.name}</span></td>
}

function ActionColumnHeader({areaProps, filters, updateFilter}) {
    React.useEffect(() => {
        areaProps.addField('category_id');
        areaProps.addField('editUrl');
        areaProps.addField('deleteUrl');
    }, []);

    const onClick = () => {
        areaProps.cleanFilter();
    };

    return <th className={"column action-column"}>
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
        <div>
            <a className="text-danger"
               onClick={
                   () => {
                       if (window.confirm('Are you sure?'))
                           Fetch(row.deleteUrl, false, 'GET');
                   }
               }>
                <i className="fas fa-trash-alt"></i>
            </a>
        </div>
    </td>
}

function StatusColumnHeader({areaProps, filters, updateFilter})
{
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("status");
    }, []);

    const onChange = (e) => {
        updateFilter("status", "=", `${e.target.value}`)
    };

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'status') === -1 ? null : filterInput.current.value;
    });

    return <th>
        <div className="table-header status-header">
            <div className={"title"}><span>Status</span></div>
            <div className={"filter"}>
                <select
                    className="form-control"
                    ref={filterInput}
                    onChange={(e)=> onChange(e)}
                >
                    <option value={1}>Enable</option>
                    <option value={0}>Disable</option>
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

function ShowNavColumnHeader({areaProps, filters, updateFilter})
{
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("include_in_nav");
    }, []);

    const onChange = (e) => {
        updateFilter("include_in_nav", "=", `${e.target.value}`)
    };

    React.useEffect(() => {
        filterInput.current.value = filters.findIndex((e)=> e.key === 'include_in_nav') === -1 ? null : filterInput.current.value;
    });

    return <th>
        <div className="table-header status-header">
            <div className={"title"}><span>Show in navigation?</span></div>
            <div className={"filter"}>
                <select
                    className="form-control"
                    ref={filterInput}
                    onChange={(e)=> onChange(e)}
                >
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                </select>
            </div>
        </div>
    </th>
}

function ShowNavColumnRow({row}) {
    if(parseInt(_.get(row, "status")) === 1)
        return <td><span className="badge badge-success">Yes</span></td>;
    else
        return <td><span className="badge badge-secondary">No</span></td>;
}

export default function CategoryGrid({apiUrl, areaProps})
{
    const [categories, setCategories] = React.useState([]);
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
                if(_.get(response, 'payload.data.categoryCollection.categories')) {
                    setCategories(_.get(response, 'payload.data.categoryCollection.categories'));
                    setTotal(_.get(response, 'payload.data.categoryCollection.total'));
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

        return `{categoryCollection (filters : ${filterStr}) {categories {${fieldStr}} total currentFilter}}`
    };

    React.useEffect(() => {
        if(fields.length === 0)
            return;
        applyFilter();
    }, [fields, areaProps.filters]);

    return <div className={"category-grid mt-4"}>
        <table className="table table-bordered sticky">
            <thead>
                <tr>
                    <Area
                        className={""}
                        id={"category_grid_header"}
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
                                component: NameColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 20,
                                id: "name"
                            },
                            {
                                component: StatusColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 30,
                                id: "status"
                            },
                            {
                                component: ShowNavColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 40,
                                id: "show_nav"
                            },
                            {
                                component: ActionColumnHeader,
                                props : {...areaProps, addField, applyFilter},
                                sort_order: 50,
                                id: "action"
                            }
                        ]}
                    />
                </tr>
            </thead>
            <tbody>
            {categories.map((c, i)=> {
                return <tr>
                    <Area
                        key={i}
                        className={""}
                        id={"category_grid_row"}
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
                                component: NameColumnRow,
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
                                component: ShowNavColumnRow,
                                props : {row: c},
                                sort_order: 40,
                                id: "show_nav"
                            },
                            {
                                component: ActionColumnRow,
                                props : {row: c},
                                sort_order: 50,
                                id: "action"
                            }
                        ]}
                    />
                </tr>
            })}
            </tbody>
        </table>
        {categories.length === 0 &&
        <div>There is no category to display</div>
        }
        <Pagination total={total} currentFilters={areaProps.filters} setFilter={areaProps.updateFilter}/>
    </div>
}