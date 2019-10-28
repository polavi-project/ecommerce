import Area from "../../../../../../../js/production/area.js";
import A from "../../../../../../../js/production/a.js";
import {Fetch} from "../../../../../../../js/production/fetch.js";

function IdColumnHeader({areaProps}) {
    const filterFrom = React.useRef(null);
    const filterTo = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField("cms_widget_id");
    }, []);

    return <td>
        <div className="header id-header">
            <div className={"title"}><span>ID</span></div>
            <div className={"filter"}>
                <input
                    className="uk-select uk-form-small"
                    type={"text"}
                    ref={filterFrom}
                    onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("id", "BETWEEN", `${e.target.value} AND ${filterTo.current.value}`);}}
                    placeholder={"From"}
                />
                <input
                    className="uk-select uk-form-small"
                    type={"text"}
                    ref={filterTo}
                    onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("id", "BETWEEN", `${filterFrom.current.value} AND ${e.target.value}`);}}
                    placeholder={"To"}
                />
            </div>
        </div>
    </td>
}

function IdColumnRow({row}) {
    return <td><span>{row.cms_widget_id}</span></td>;
}

function NameColumnHeader({areaProps}) {
    const filterInput = React.useRef(null);

    React.useEffect(() => {
        areaProps.addField('name');
    }, []);

    return <td>
        <div className="header name-header">
            <div className={"title"}><span>Widget name</span></div>
            <div className={"filter"}>
                <input
                    className="uk-select uk-form-small"
                    type={"text"}
                    ref={filterInput}
                    onKeyPress={(e) => { if(e.key === 'Enter') areaProps.addFilter("name", "LIKE", `%${e.target.value}%`);}}
                    placeholder={"Widget name"}
                />
            </div>
        </div>
    </td>
}

function NameColumnRow({row}) {
    return <td><span>{_.get(row, 'name' , '')}</span></td>;
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

function ActionColumnHeader({areaProps}) {
    React.useEffect(() => {
        areaProps.addField('editUrl');
    }, []);

    return <td>
        <div className="header">
            <div className={"title"}><span>Action</span></div>
        </div>
    </td>
}

function ActionColumnRow({row}) {
    return <td><A url={_.get(row, 'editUrl' , '')} text={"Edit"}/></td>;
}

function WidgetGrid({apiUrl, defaultFilter})
{
    const [widgets, setWidgets] = React.useState([]);
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

        Fetch(
            apiUrl,
            false,
            'POST',
            formData,
            null,
            (response) => {
                if(_.get(response, 'payload.data.widgetCollection.widgets')) {
                    setWidgets(_.get(response, 'payload.data.widgetCollection.widgets'));
                }
            }
        );
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

        return `{widgetCollection ${filterStr} {widgets {${fieldStr}} total currentFilter}}`
    };

    React.useEffect(() => {
        if(fields.length === 0)
            return;
        applyFilter();
    }, [fields, filters]);

    return <div className={"uk-overflow-auto"}>
        <table className="uk-table uk-table-small">
            <thead>
            <Area
                className={""}
                id={"widget_grid_header"}
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
                        component: NameColumnHeader,
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
            {widgets.map((p, i)=> {
                return <Area
                    key={i}
                    className={""}
                    id={"widget_grid_row"}
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
                            component: NameColumnRow,
                            props : {row: p},
                            sort_order: 20,
                            id: "name"
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
                            sort_order: 50,
                            id: "action"
                        }
                    ]}
                />
            })}
            </tbody>
        </table>
        {widgets.length === 0 &&
        <div>There is no widget to display</div>
        }
    </div>
}

export {WidgetGrid}