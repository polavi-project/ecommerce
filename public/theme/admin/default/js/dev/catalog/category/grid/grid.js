import Area from "../../../../../../../../js/production/area.js";
import A from "../../../../../../../../js/production/a.js";
import {Fetch} from "../../../../../../../../js/production/fetch.js";

function IdColumnHeader({areaProps, filters, updateFilter}) {
    React.useEffect(() => {
        areaProps.addField("category_id");
    }, []);

    return <th>
        <div className="header id-header">
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
        <div className="header name-header">
            <div className={"title"}><span>Category name</span></div>
            <div className={"filter"}>
                <input
                    type={"text"}
                    ref={filterInput}
                    onKeyPress={(e) => onKeyPress(e)}
                    placeholder={"Category name"}
                    className="uk-input uk-form-small uk-form-width-small"
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
        <div className="header status-header">
            <div className={"title"}><span>Status</span></div>
            <div className={"filter"}>
                <select
                    className="uk-select uk-form-small uk-form-width-small"
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
        return <td><span className="uk-label uk-label-success">Enable</span></td>;
    else
        return <td><span className="uk-label uk-label-danger">Disabled</span></td>;
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
        <div className="header status-header">
            <div className={"title"}><span>Show in navigation?</span></div>
            <div className={"filter"}>
                <select
                    className="uk-select uk-form-small uk-form-width-small"
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
        return <td><span className="uk-label uk-label-success">Yes</span></td>;
    else
        return <td><span className="uk-label uk-label-danger">No</span></td>;
}

export default function CategoryGrid({apiUrl, areaProps})
{
    const [categories, setCategories] = React.useState([]);
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
                if(_.get(response, 'payload.data.categoryCollection.categories')) {
                    setCategories(_.get(response, 'payload.data.categoryCollection.categories'));
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

        return `{categoryCollection ${filterStr} {categories {${fieldStr}} total currentFilter}}`
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
                id={"category_grid_header"}
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
            </thead>
            <tbody>
            {categories.map((c, i)=> {
                return <Area
                    key={i}
                    className={""}
                    id={"category_grid_row"}
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
            })}
            </tbody>
        </table>
        {categories.length === 0 &&
        <div>There is no category to display</div>
        }
    </div>
}